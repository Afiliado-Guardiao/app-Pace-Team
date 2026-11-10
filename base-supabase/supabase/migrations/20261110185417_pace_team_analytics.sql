-- =============================================================================
-- PACE TEAM ANALYTICS (Team Pro) — 2026-11-10
-- -----------------------------------------------------------------------------
-- get_team_analytics(): números da equipe do atleta, todos calculados das
-- corridas válidas (nada é guardado à parte, nada muda pontos ou ranking).
-- - weeks: as últimas 8 semanas (km, pontos, quem correu, posição na cidade
--   e categoria — a mesma ordem do get_team_ranking)
-- - members: km/corridas/dias da semana, da semana passada e dos últimos 28 dias
-- - rival: a equipe logo à frente nesta semana (ou a logo atrás, se somos 1º)
-- Só para quem tem o Team Pro (equipe PRO e dentro das 10 vagas).
-- =============================================================================

create or replace function public.team_week_rank(p_team uuid, p_week timestamptz)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with mine as (select t.size, t.city from public.teams t where t.id = p_team),
  ranked as (
    select t.id,
           (rank() over (order by w.points desc, w.km desc, t.created_at))::int as pos
      from public.teams t
      join public.team_week_totals(p_week) w on w.team_id = t.id
      join mine on t.size = mine.size and t.city = mine.city
  )
  select jsonb_build_object(
    'position', (select r.pos from ranked r where r.id = p_team),
    'teams', (select count(*) from ranked)
  );
$$;

create or replace function public.get_team_analytics()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  mine public.teams;
  this_week timestamptz := public.week_start();
  my_points bigint;
  my_km numeric;
  rival record;
begin
  select t.* into mine
    from public.teams t
    join public.team_members m on m.team_id = t.id
   where m.user_id = uid;
  if mine.id is null then
    return null;
  end if;
  if (public.team_pro_subscription(mine.id)).id is null
     or not exists (select 1 from public.team_pro_covered(mine.id) c where c.user_id = uid) then
    raise exception 'not_pro' using errcode = 'P0001';
  end if;

  select w.points, w.km into my_points, my_km
    from public.team_week_totals(this_week) w where w.team_id = mine.id;

  -- Rival da semana: logo à frente; se já somos 1º, a logo atrás
  with ranked as (
    select t.id, t.name, t.logo_url, w.points, w.km,
           (rank() over (order by w.points desc, w.km desc, t.created_at))::int as pos
      from public.teams t
      join public.team_week_totals(this_week) w on w.team_id = t.id
     where t.size = mine.size and t.city = mine.city
  ),
  me as (select r.pos from ranked r where r.id = mine.id)
  select r.* into rival
    from ranked r, me
   where r.id <> mine.id
   order by (r.pos < me.pos) desc, abs(r.pos - me.pos), r.pos
   limit 1;

  return jsonb_build_object(
    'team', jsonb_build_object(
      'id', mine.id,
      'name', mine.name,
      'city', mine.city,
      'size', mine.size,
      'logoUrl', mine.logo_url,
      'members', (select count(*) from public.team_members m where m.team_id = mine.id)
    ),
    'weekStart', this_week,
    'weeks', (
      select jsonb_agg(jsonb_build_object(
        'start', g.ws,
        'km', round(coalesce(w.km, 0), 1),
        'points', coalesce(w.points, 0),
        'runs', (
          select count(*) from public.runs r
           where r.team_id = mine.id and r.status = 'valid'
             and r.started_at >= g.ws and r.started_at < g.ws + interval '7 days'
        ),
        'runners', (
          select count(distinct r.user_id) from public.runs r
           where r.team_id = mine.id and r.status = 'valid'
             and r.started_at >= g.ws and r.started_at < g.ws + interval '7 days'
        ),
        'rank', public.team_week_rank(mine.id, g.ws)
      ) order by g.ws)
      from (select this_week - n * interval '7 days' as ws from generate_series(0, 7) as n) g
      left join lateral (
        select t.points, t.km from public.team_week_totals(g.ws) t where t.team_id = mine.id
      ) w on true
    ),
    'members', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'avatarPath', p.avatar_path,
        'role', m.role,
        'isYou', p.id = uid,
        'weekKm', round(coalesce(s.week_km, 0), 1),
        'weekRuns', coalesce(s.week_runs, 0),
        'weekDays', coalesce(s.week_days, 0),
        'prevWeekKm', round(coalesce(s.prev_km, 0), 1),
        'km28', round(coalesce(s.km28, 0), 1),
        'days28', coalesce(s.days28, 0)
      ) order by coalesce(s.week_km, 0) desc, m.joined_at), '[]'::jsonb)
      from public.team_members m
      join public.profiles p on p.id = m.user_id
      left join lateral (
        select
          sum(r.distance_m) filter (where r.started_at >= this_week) / 1000.0 as week_km,
          count(*) filter (where r.started_at >= this_week) as week_runs,
          count(distinct (r.started_at at time zone 'America/Sao_Paulo')::date)
            filter (where r.started_at >= this_week) as week_days,
          sum(r.distance_m) filter (
            where r.started_at >= this_week - interval '7 days' and r.started_at < this_week
          ) / 1000.0 as prev_km,
          sum(r.distance_m) filter (where r.started_at >= now() - interval '28 days') / 1000.0 as km28,
          count(distinct (r.started_at at time zone 'America/Sao_Paulo')::date)
            filter (where r.started_at >= now() - interval '28 days') as days28
        from public.runs r
        where r.user_id = m.user_id and r.team_id = mine.id and r.status = 'valid'
          and r.started_at >= least(this_week - interval '7 days', now() - interval '28 days')
      ) s on true
      where m.team_id = mine.id
    ),
    'rival', case when rival.id is null then null else jsonb_build_object(
      'name', rival.name,
      'logoUrl', rival.logo_url,
      'position', rival.pos,
      'points', rival.points,
      'km', round(rival.km, 1),
      'gapPoints', rival.points - coalesce(my_points, 0),
      'gapKm', round(rival.km - coalesce(my_km, 0), 1)
    ) end
  );
end;
$$;

revoke execute on function public.team_week_rank(uuid, timestamptz) from public, anon, authenticated;
revoke execute on function public.get_team_analytics() from public, anon;
grant execute on function public.get_team_analytics() to authenticated;
