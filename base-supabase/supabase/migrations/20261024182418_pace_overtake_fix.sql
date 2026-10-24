-- =============================================================================
-- PACE TEAM · ultrapassagem só conta se o rival estava à frente
-- -----------------------------------------------------------------------------
-- Correção da pace_notifications_challenges: uma equipe empatada com a nossa
-- (ex.: as duas com 0 pts no começo da semana) não é "ultrapassada". Agora só
-- avisa quando o rival tinha mais pontos antes da corrida e menos depois.
-- =============================================================================

-- Colegas, meta coletiva e ultrapassagens no ranking da cidade.
create or replace function public.notify_run_team(p_run public.runs, p_author text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.teams;
  wk timestamptz := public.week_start(p_run.started_at);
  team_km numeric;
  goal numeric;
  pts_after bigint;
  pts_before bigint;
  rival record;
begin
  select * into t from public.teams where id = p_run.team_id;
  if t.id is null then
    return;
  end if;

  perform public.notify_team(t.id, p_run.user_id, 'team_run', 'footprints', 'neutral',
    p_author || ' concluiu uma corrida',
    public.fmt_km(p_run.distance_m) || ' km · +' || p_run.points || ' pts para o time', null, null);

  select coalesce(sum(r.distance_m), 0) into team_km
    from public.runs r
   where r.team_id = t.id and r.status = 'valid'
     and r.started_at >= wk and r.started_at < wk + interval '7 days';
  goal := t.size * 50000;
  if team_km >= goal and team_km - p_run.distance_m < goal then
    perform public.notify_team(t.id, null, 'team_goal', 'target', 'success',
      'Meta coletiva atingida!', 'Time correu ' || public.fmt_km(team_km) || ' km nesta semana',
      'team', 'team_goal:' || t.id || ':' || wk::date);
  end if;

  -- Ultrapassagens: só contam na semana do ranking em andamento
  if wk <> public.week_start() or p_run.points <= 0 then
    return;
  end if;
  pts_after := public.team_week_points(t.id, wk);
  pts_before := pts_after - p_run.points;
  for rival in
    select o.id, o.name, w.points
      from public.teams o
      join public.team_week_totals(wk) w on w.team_id = o.id
     where o.size = t.size and o.city = t.city and o.id <> t.id
       and w.points > pts_before and w.points < pts_after
  loop
    perform public.notify_team(t.id, null, 'overtook', 'trending-up', 'success',
      'Vocês passaram os ' || rival.name,
      t.name || ' agora está em ' || public.team_city_position(t.id, wk) || 'º em ' || t.city,
      'disputa', null);
    perform public.notify_team(rival.id, null, 'overtaken', 'trending-down', 'danger',
      t.name || ' ultrapassou vocês',
      rival.name || ' caiu para ' || public.team_city_position(rival.id, wk) || 'º em ' || t.city,
      'disputa', null);
  end loop;
end;
$$;

revoke execute on function public.notify_run_team(public.runs, text) from public, anon, authenticated;
