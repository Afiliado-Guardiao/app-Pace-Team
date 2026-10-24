-- =============================================================================
-- PACE TEAM · Modo Virada e "corrida da equipe" com dados reais
-- -----------------------------------------------------------------------------
-- So funcoes novas (nenhuma tabela ou dado existente muda):
-- - get_virada(): disputa da minha equipe com a equipe logo a frente no
--   ranking da semana (mesma categoria e cidade). Se ja estamos em 1o, o
--   rival e a equipe logo atras. Traz pontos por dia, os 4 ultimos
--   confrontos semanais e a contribuicao de cada integrante.
-- - get_team_last_runs(): corridas validas da equipe no dia mais recente em
--   que alguem correu (card "Ultima corrida da equipe" do Inicio).
-- =============================================================================

-- Pontos validos de uma equipe por dia (0 = segunda ... 6 = domingo) na semana.
create or replace function public.team_week_days(p_team_id uuid, p_week timestamptz)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_agg(coalesce((
    select sum(r.points) from public.runs r
     where r.team_id = p_team_id and r.status = 'valid'
       and r.started_at >= p_week + (g.day * interval '1 day')
       and r.started_at < p_week + ((g.day + 1) * interval '1 day')
  ), 0) order by g.day)
  from generate_series(0, 6) as g(day);
$$;

-- Pontos validos de uma equipe numa semana.
create or replace function public.team_week_points(p_team_id uuid, p_week timestamptz)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(r.points), 0) from public.runs r
   where r.team_id = p_team_id and r.status = 'valid'
     and r.started_at >= p_week and r.started_at < p_week + interval '7 days';
$$;

create or replace function public.get_virada()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  mine public.teams;
  this_week timestamptz := public.week_start();
  my_pos int;
  rival_id uuid;
  ranked jsonb;
begin
  select t.* into mine
    from public.teams t
    join public.team_members m on m.team_id = t.id
   where m.user_id = uid;
  if mine.id is null then
    return null;
  end if;

  -- Ranking da semana na minha categoria e cidade (mesma ordem do get_team_ranking).
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', x.id, 'name', x.name, 'city', x.city, 'points', x.points,
    'km', round(x.km, 1), 'position', x.pos, 'isYou', x.id = mine.id
  ) order by x.pos), '[]'::jsonb)
  into ranked
  from (
    select t.id, t.name, t.city, w.points, w.km,
           (rank() over (order by w.points desc, w.km desc, t.created_at))::int as pos
      from public.teams t
      join public.team_week_totals(this_week) w on w.team_id = t.id
     where t.size = mine.size and t.city = mine.city
  ) x;

  select (e ->> 'position')::int into my_pos
    from jsonb_array_elements(ranked) e where (e ->> 'isYou')::boolean;

  -- Rival: a equipe logo a frente; se ja somos 1o, a logo atras.
  select (e ->> 'id')::uuid into rival_id
    from jsonb_array_elements(ranked) e
   where not (e ->> 'isYou')::boolean and (e ->> 'position')::int < my_pos
   order by (e ->> 'position')::int desc limit 1;
  if rival_id is null then
    select (e ->> 'id')::uuid into rival_id
      from jsonb_array_elements(ranked) e
     where not (e ->> 'isYou')::boolean
     order by (e ->> 'position')::int limit 1;
  end if;

  return jsonb_build_object(
    'team', (
      select e - 'isYou' from jsonb_array_elements(ranked) e where (e ->> 'isYou')::boolean
    ),
    'rival', (
      select e - 'isYou' from jsonb_array_elements(ranked) e where (e ->> 'id')::uuid = rival_id
    ),
    -- Linhas do ranking em volta do confronto (ate 3 acima e 1 abaixo).
    'rows', (
      select coalesce(jsonb_agg(e order by (e ->> 'position')::int), '[]'::jsonb)
        from jsonb_array_elements(ranked) e
       where (e ->> 'position')::int between my_pos - 3 and my_pos + 1
    ),
    'weekDays', jsonb_build_object(
      'us', public.team_week_days(mine.id, this_week),
      'them', case when rival_id is null then null else public.team_week_days(rival_id, this_week) end
    ),
    'headToHead', case when rival_id is null then '[]'::jsonb else (
      select jsonb_agg(jsonb_build_object(
        'week', extract(week from (this_week - g.n * interval '7 days') at time zone 'America/Sao_Paulo')::int,
        'us', public.team_week_points(mine.id, this_week - g.n * interval '7 days'),
        'them', public.team_week_points(rival_id, this_week - g.n * interval '7 days')
      ) order by g.n)
      from generate_series(1, 4) as g(n)
    ) end,
    'members', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'role', m.role,
        'isYou', p.id = uid,
        'points', coalesce((
          select sum(r.points) from public.runs r
           where r.user_id = p.id and r.team_id = mine.id and r.status = 'valid'
             and r.started_at >= this_week
        ), 0)
      ) order by m.joined_at), '[]'::jsonb)
      from public.team_members m
      join public.profiles p on p.id = m.user_id
      where m.team_id = mine.id
    )
  );
end;
$$;

-- Corridas validas da minha equipe no dia mais recente com corrida (Sao Paulo).
create or replace function public.get_team_last_runs()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  last_day date;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null then
    return null;
  end if;

  select (max(r.started_at) at time zone 'America/Sao_Paulo')::date into last_day
    from public.runs r
   where r.team_id = my_team and r.status = 'valid';
  if last_day is null then
    return jsonb_build_object('teamId', my_team, 'day', null, 'lastAt', null, 'runs', '[]'::jsonb);
  end if;

  return (
    select jsonb_build_object(
      'teamId', my_team,
      'day', last_day,
      'lastAt', max(r.started_at),
      'runs', jsonb_agg(jsonb_build_object(
        'id', r.id,
        'userId', r.user_id,
        'name', p.name,
        'isYou', r.user_id = uid,
        'km', round(r.distance_m / 1000.0, 2),
        'seconds', r.duration_s,
        'points', r.points,
        'startedAt', r.started_at
      ) order by r.distance_m desc)
    )
    from public.runs r
    join public.profiles p on p.id = r.user_id
    where r.team_id = my_team and r.status = 'valid'
      and (r.started_at at time zone 'America/Sao_Paulo')::date = last_day
  );
end;
$$;

-- -----------------------------------------------------------------------------
-- Permissoes
-- -----------------------------------------------------------------------------
revoke execute on function public.team_week_days(uuid, timestamptz)   from public, anon, authenticated;
revoke execute on function public.team_week_points(uuid, timestamptz) from public, anon, authenticated;
revoke execute on function public.get_virada()                        from public, anon;
revoke execute on function public.get_team_last_runs()                from public, anon;

grant execute on function public.get_virada()         to authenticated;
grant execute on function public.get_team_last_runs() to authenticated;
