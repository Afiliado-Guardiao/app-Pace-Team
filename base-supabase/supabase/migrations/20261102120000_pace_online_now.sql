-- "Online" é só quem está com o app aberto agora ou correndo com a equipe.
-- Antes valia por 15 min depois do último sinal, e o colega continuava online
-- mesmo depois de fechar o app.
--   * o app manda sinal a cada 1 min enquanto está aberto e chama go_offline
--     ao ir para o fundo; a janela cai para 3 min (folga para internet ruim);
--   * quem está correndo com a equipe (posição ao vivo) conta como online,
--     mesmo com a tela bloqueada;
--   * a posição ao vivo vale por 10 min: parado (ex.: esperando o colega),
--     o celular não manda posição nova e o atleta sumia do mapa em 2 min.

create or replace function public.go_offline()
returns void
language plpgsql
security definer
set search_path to ''
as $$
begin
  delete from public.team_presence_pings where user_id = (select auth.uid());
end;
$$;

revoke all on function public.go_offline() from public, anon;
grant execute on function public.go_offline() to authenticated;

create or replace function public.get_team_online()
returns jsonb
language sql
stable
security definer
set search_path to ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', x.user_id,
    'name', x.name,
    'avatarPath', x.avatar_path,
    'lastSeen', x.last_seen,
    'color', case
      when x.color in ('bronze', 'prata', 'ouro') and x.color is distinct from (
        case public.team_city_position(x.team_id, public.week_start())
          when 1 then 'ouro' when 2 then 'prata' when 3 then 'bronze' end
      ) then coalesce(x.last_free, 'branco')
      else coalesce(x.color, 'branco')
    end,
    'equipped', coalesce(to_jsonb(x.equipped), '[]'::jsonb)
  ) order by x.last_seen desc), '[]'::jsonb)
  from (
    select s.user_id, s.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped,
           max(s.at) as last_seen
      from (
        select pp.user_id, pp.team_id, pp.at
          from public.team_presence_pings pp
         where pp.at > now() - interval '3 minutes'
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
     group by s.user_id, s.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped
  ) x;
$$;

create or replace function public.get_team_live_positions()
returns jsonb
language sql
stable
security definer
set search_path to ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', l.user_id,
    'name', coalesce(nullif(p.name, ''), 'Atleta'),
    'avatarPath', p.avatar_path,
    'lat', l.lat,
    'lng', l.lng,
    'at', l.updated_at
  ) order by p.name), '[]'::jsonb)
  from public.team_live_positions l
  join public.team_members me on me.team_id = l.team_id and me.user_id = (select auth.uid())
  join public.profiles p on p.id = l.user_id
  where l.user_id <> (select auth.uid())
    and l.updated_at > now() - interval '10 minutes';
$$;
