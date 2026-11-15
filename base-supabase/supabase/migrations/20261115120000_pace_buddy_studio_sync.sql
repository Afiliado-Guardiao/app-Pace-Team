-- =============================================================================
-- Visual do Buddy Studio para a equipe (item 4 do build 43)
-- -----------------------------------------------------------------------------
-- O app grava a escolha do Studio em buddy_profiles.studio:
--   { "color": "neon" | null, "items": ["samurai", ...] }
-- get_team_online passa a devolver o visual do Studio do colega SÓ enquanto
-- ele está coberto pelo Team Pro (assinatura da equipe + até 10 integrantes).
-- Sem Pro (ou sem escolha), continua a cor e os acessórios conquistados.
-- =============================================================================

alter table public.buddy_profiles
  add column if not exists studio jsonb not null default '{}'::jsonb;

alter table public.buddy_profiles
  add constraint buddy_profiles_studio_shape
  check (jsonb_typeof(studio) = 'object' and pg_column_size(studio) < 2000);

grant select (studio), insert (studio), update (studio) on public.buddy_profiles to authenticated;

-- O atleta está coberto pelo Team Pro da equipe agora?
create or replace function public.user_has_pro(p_user uuid, p_team uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  sub public.subscriptions;
begin
  if p_user is null or p_team is null then
    return false;
  end if;
  sub := public.team_pro_subscription(p_team);
  if sub.id is null then
    return false;
  end if;
  return exists (select 1 from public.team_pro_covered(p_team) c where c.user_id = p_user);
end;
$$;

revoke execute on function public.user_has_pro(uuid, uuid) from public, anon, authenticated;

-- Itens do Studio (só nomes simples: letras, até 6 itens)
create or replace function public.studio_items(p_studio jsonb)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select coalesce(array_agg(v order by o), '{}'::text[])
    from jsonb_array_elements_text(
           case when jsonb_typeof(p_studio -> 'items') = 'array' then p_studio -> 'items' else '[]'::jsonb end
         ) with ordinality as e(v, o)
   where v ~ '^[A-Za-z]{2,24}$' and v <> 'coroa' and o <= 6;
$$;

revoke execute on function public.studio_items(jsonb) from public, anon, authenticated;

create or replace function public.get_team_online()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', x.user_id,
    'name', x.name,
    'avatarPath', x.avatar_path,
    'lastSeen', x.last_seen,
    'color', case
      -- Visual do Studio (Team Pro)
      when x.is_pro and coalesce(x.studio ->> 'color', '') ~ '^[a-z]{2,20}$' then x.studio ->> 'color'
      when x.color in ('bronze', 'prata', 'ouro') and x.color is distinct from (
        case public.team_city_position(x.team_id, public.week_start())
          when 1 then 'ouro' when 2 then 'prata' when 3 then 'bronze' end
      ) then coalesce(x.last_free, 'branco')
      else coalesce(x.color, 'branco')
    end,
    'equipped', case
      when x.is_pro and cardinality(public.studio_items(x.studio)) > 0
        then to_jsonb(public.studio_items(x.studio))
      else coalesce(to_jsonb(array_remove(x.equipped, 'coroa')), '[]'::jsonb)
    end,
    'crown', x.user_id = public.team_top_member(x.team_id) and not coalesce(x.hide_crown, false)
  ) order by x.last_seen desc), '[]'::jsonb)
  from (
    select y.*, public.user_has_pro(y.user_id, y.team_id) as is_pro
      from (
        select s.user_id, s.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped,
               b.hide_crown, coalesce(b.studio, '{}'::jsonb) as studio,
               max(s.at) as last_seen
          from (
            select pp.user_id, pp.team_id, pp.at
              from public.team_presence_pings pp
             where pp.at > now() - interval '10 minutes'
            union all
            select l.user_id, l.team_id, l.updated_at
              from public.team_live_positions l
             where l.updated_at > now() - interval '10 minutes'
          ) s
          join public.team_members me on me.team_id = s.team_id and me.user_id = (select auth.uid())
          join public.team_members tm on tm.team_id = s.team_id and tm.user_id = s.user_id
          join public.profiles p on p.id = s.user_id
          left join public.buddy_profiles b on b.user_id = s.user_id
         where s.user_id <> (select auth.uid())
         group by s.user_id, s.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped,
                  b.hide_crown, b.studio
      ) y
  ) x;
$$;
