-- Roleta da equipe: push para cada participante quando a roleta termina de
-- girar ("Você está na roleta! Fulano sorteou para você 5 km no pace 4'00").
-- Edge Function team-game-push chama esta RPC com o JWT de quem chamou a
-- roleta: só ele pede, uma vez por roleta, até 30 min depois do último giro.

alter table public.team_games add column if not exists pushed_at timestamptz;

-- 240 → 4'00"
create or replace function public.fmt_pace(p_seconds int)
returns text
language sql
immutable
set search_path = ''
as $$
  select (p_seconds / 60)::text || '''' || lpad((p_seconds % 60)::text, 2, '0') || '"';
$$;

create or replace function public.team_game_push_targets(p_game uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  g public.team_games;
  starter text;
begin
  update public.team_games
     set pushed_at = now()
   where id = p_game and started_by = uid and status = 'running' and pushed_at is null
     and running_at > now() - interval '30 minutes'
  returning * into g;
  if g.id is null then
    return jsonb_build_object('recipients', '[]'::jsonb);
  end if;

  select coalesce(nullif(p.name, ''), 'Um colega') into starter
    from public.profiles p where p.id = uid;

  return jsonb_build_object(
    'gameId', g.id,
    'title', 'Você está na roleta da equipe!',
    'recipients', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'userId', d.user_id,
        'token', d.token,
        'body', starter || ' sorteou para você: ' || public.fmt_km(gp.km * 1000)
          || ' km no pace ' || public.fmt_pace(gp.pace_s) || '/km. Toque para correr.'
      )), '[]'::jsonb)
        from public.team_game_players gp
        join public.device_tokens d on d.user_id = gp.user_id
       where gp.game_id = g.id and gp.user_id <> uid
         and gp.km is not null and gp.pace_s is not null
    )
  );
end;
$$;

revoke all on function public.team_game_push_targets(uuid) from public, anon;
grant execute on function public.team_game_push_targets(uuid) to authenticated;
revoke all on function public.fmt_pace(int) from public, anon;
grant execute on function public.fmt_pace(int) to authenticated;
