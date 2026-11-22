-- Roleta da equipe: resultado para todos e pontos na conta de cada um.
-- 1. get_team_game devolve o que cada um correu (km e tempo), para o pop-up
--    do resultado mostrar o desafio ao lado do que a pessoa fez.
-- 2. Os pontos da roleta (ganhos ou perdidos) entram nos pontos individuais:
--    Início, Histórico, equipe, disputa e perfil (nunca abaixo de zero). Antes
--    só entravam no total da equipe.
-- 3. get_my_game_points: a lista para o Histórico ("Roleta da equipe −10").
-- 4. team_game_result_targets: avisa no celular, uma vez por roleta, quando
--    todos terminam (Edge Function team-game-push, kind "result").

alter table public.team_games add column if not exists result_pushed_at timestamptz;

-- Pontos de roleta de uma pessoa desde uma data (na equipe, ou em todas)
create or replace function public.member_game_points(p_user uuid, p_team uuid, p_from timestamptz)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(gp.points), 0)
    from public.team_games g
    join public.team_game_players gp on gp.game_id = g.id
   where gp.user_id = p_user and g.status = 'done' and g.settled_at >= p_from
     and (p_team is null or g.team_id = p_team);
$$;

revoke execute on function public.member_game_points(uuid, uuid, timestamptz) from public, anon, authenticated;

-- As minhas roletas fechadas (as 100 últimas), para o Histórico
create or replace function public.get_my_game_points()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
begin
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'gameId', x.id,
      'at', x.settled_at,
      'points', x.points,
      'status', x.status,
      'km', x.km,
      'pace', x.pace_s,
      'runId', x.run_id,
      'runKm', round(x.distance_m / 1000.0, 3),
      'runSeconds', x.duration_s
    ) order by x.settled_at desc), '[]'::jsonb)
    from (
      select g.id, g.settled_at, gp.points, gp.status, gp.km, gp.pace_s, gp.run_id, r.distance_m, r.duration_s
        from public.team_game_players gp
        join public.team_games g on g.id = gp.game_id
        left join public.runs r on r.id = gp.run_id
       where gp.user_id = uid and g.status = 'done' and gp.points is not null
       order by g.settled_at desc
       limit 100
    ) x
  );
end;
$$;

revoke execute on function public.get_my_game_points() from public, anon;
grant execute on function public.get_my_game_points() to authenticated;

-- Quem recebe o aviso do resultado: só quem jogou pede, uma vez por roleta
create or replace function public.team_game_result_targets(p_game uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  g public.team_games;
  winners text;
  losers text;
begin
  update public.team_games tg
     set result_pushed_at = now()
   where tg.id = p_game and tg.status = 'done' and tg.result_pushed_at is null
     and tg.settled_at > now() - interval '6 hours'
     and exists (
       select 1 from public.team_game_players gp where gp.game_id = tg.id and gp.user_id = uid
     )
  returning * into g;
  if g.id is null then
    return jsonb_build_object('recipients', '[]'::jsonb);
  end if;

  select string_agg(split_part(coalesce(nullif(p.name, ''), 'Atleta'), ' ', 1), ', ' order by gp.slot)
           filter (where gp.status = 'done'),
         string_agg(split_part(coalesce(nullif(p.name, ''), 'Atleta'), ' ', 1), ', ' order by gp.slot)
           filter (where gp.status = 'failed')
    into winners, losers
    from public.team_game_players gp
    join public.profiles p on p.id = gp.user_id
   where gp.game_id = g.id;

  return jsonb_build_object(
    'gameId', g.id,
    'title', 'A roleta da equipe terminou',
    'recipients', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'userId', d.user_id,
        'token', d.token,
        'body', case when g.is_success
          then 'Todos cumpriram! Toque para ver o resultado.'
          else concat_ws(' ', 'Cumpriu: ' || winners || '.', 'Não cumpriu: ' || losers || '.', 'Toque para ver.')
        end
      )), '[]'::jsonb)
        from public.team_game_players gp
        join public.device_tokens d on d.user_id = gp.user_id
       where gp.game_id = g.id and gp.user_id <> uid
    )
  );
end;
$$;

revoke execute on function public.team_game_result_targets(uuid) from public, anon;
grant execute on function public.team_game_result_targets(uuid) to authenticated;

create or replace function public.get_team_game()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  g public.team_games;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null then
    return null;
  end if;
  perform public.team_game_tidy(my_team);

  select * into g from public.team_games
   where team_id = my_team
     and (status in ('spinning', 'running')
          or (status = 'done' and settled_at > now() - interval '6 hours'))
   order by created_at desc limit 1;
  if g.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'id', g.id,
    'level', g.level,
    'status', g.status,
    'isStarter', g.started_by = uid,
    'starterName', (select coalesce(nullif(p.name, ''), 'Atleta') from public.profiles p where p.id = g.started_by),
    'createdAt', g.created_at,
    'endsAt', g.ends_at,
    'isSuccess', g.is_success,
    'settledAt', g.settled_at,
    'wheel', public.team_game_wheel(g.level),
    'stakes', public.team_game_stakes(g.level),
    'players', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'userId', gp.user_id,
        'name', coalesce(nullif(p.name, ''), 'Atleta'),
        'avatarPath', p.avatar_path,
        'isYou', gp.user_id = uid,
        'slot', gp.slot,
        'challenge', gp.challenge,
        'km', gp.km,
        'pace', gp.pace_s,
        'assignedAt', gp.assigned_at,
        'status', gp.status,
        'points', gp.points,
        -- O que a pessoa correu no desafio (null = não correu no prazo)
        'runKm', round(r.distance_m / 1000.0, 3),
        'runSeconds', r.duration_s
      ) order by gp.slot), '[]'::jsonb)
      from public.team_game_players gp
      join public.profiles p on p.id = gp.user_id
      left join public.runs r on r.id = gp.run_id
      where gp.game_id = g.id
    )
  );
end;
$$;

create or replace function public.get_my_stats()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  this_week timestamptz := public.week_start();
  month_start timestamptz := (date_trunc('month', now() at time zone 'America/Sao_Paulo')) at time zone 'America/Sao_Paulo';
begin
  return (
    select jsonb_build_object(
      'runs', count(*),
      'km', round(coalesce(sum(r.distance_m) filter (where r.status = 'valid'), 0) / 1000.0, 1),
      'avgPace', case
        when coalesce(sum(r.distance_m) filter (where r.status = 'valid'), 0) > 0
        then round(sum(r.duration_s) filter (where r.status = 'valid') / (sum(r.distance_m) filter (where r.status = 'valid') / 1000.0))
        else 0 end,
      'weekKm', round(coalesce(sum(r.distance_m) filter (where r.status = 'valid' and r.started_at >= this_week), 0) / 1000.0, 1),
      'weekPoints', greatest(0, coalesce(sum(r.points) filter (where r.started_at >= this_week), 0)
        + public.member_game_points(uid, null, this_week)),
      'weekRuns', count(*) filter (where r.started_at >= this_week),
      'monthKm', round(coalesce(sum(r.distance_m) filter (where r.status = 'valid' and r.started_at >= month_start), 0) / 1000.0, 1),
      'monthRuns', count(*) filter (where r.started_at >= month_start),
      'monthPoints', greatest(0, coalesce(sum(r.points) filter (where r.started_at >= month_start), 0)
        + public.member_game_points(uid, null, month_start)),
      'weekDays', (
        select jsonb_agg(round(coalesce((
          select sum(x.distance_m) / 1000.0 from public.runs x
           where x.user_id = uid and x.status = 'valid'
             and x.started_at >= this_week + (g.day * interval '1 day')
             and x.started_at < this_week + ((g.day + 1) * interval '1 day')
        ), 0), 1) order by g.day)
        from generate_series(0, 6) as g(day)
      ),
      'monthWeeks', (
        select jsonb_agg(round(coalesce((
          select sum(x.distance_m) / 1000.0 from public.runs x
           where x.user_id = uid and x.status = 'valid'
             and x.started_at >= this_week - ((3 - g.w) * interval '7 days')
             and x.started_at < this_week - ((2 - g.w) * interval '7 days')
        ), 0), 1) order by g.w)
        from generate_series(0, 3) as g(w)
      )
    )
    from public.runs r
    where r.user_id = uid
  );
end;
$$;

create or replace function public.get_team(p_team_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  t public.teams;
  this_week timestamptz := public.week_start();
  week_points bigint;
  week_km numeric;
  total_km numeric;
  pos bigint;
begin
  select * into t from public.teams where id = p_team_id;
  if t.id is null then
    return null;
  end if;

  select w.points, w.km into week_points, week_km
    from public.team_week_totals(this_week) w where w.team_id = t.id;

  select count(*) + 1 into pos
    from public.team_week_totals(this_week) w
    join public.teams o on o.id = w.team_id
   where o.size = t.size and o.city = t.city and w.points > coalesce(week_points, 0);

  select coalesce(sum(r.distance_m) filter (where r.status = 'valid'), 0) / 1000.0
    into total_km from public.runs r where r.team_id = t.id;

  return jsonb_build_object(
    'id', t.id,
    'name', t.name,
    'city', t.city,
    'region', t.region,
    'state', t.state,
    'country', t.country,
    'size', t.size,
    'description', t.description,
    'logoUrl', t.logo_url,
    'inviteCode', t.invite_code,
    'createdAt', t.created_at,
    'isCaptain', t.captain_id = uid,
    'isMine', exists (select 1 from public.team_members m where m.team_id = t.id and m.user_id = uid),
    'position', pos,
    'points', coalesce(week_points, 0),
    'km', round(coalesce(week_km, 0), 1),
    'totalKm', round(total_km, 1),
    'members', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'avatarPath', p.avatar_path,
        'role', m.role,
        'isYou', p.id = uid,
        'km', round(coalesce((
          select sum(r.distance_m) from public.runs r
           where r.user_id = p.id and r.team_id = t.id and r.status = 'valid'
             and r.started_at >= this_week
        ), 0) / 1000.0, 1),
        'points', greatest(0, coalesce((
          select sum(r.points) from public.runs r
           where r.user_id = p.id and r.team_id = t.id and r.status = 'valid'
             and r.started_at >= this_week
        ), 0) + public.member_game_points(p.id, t.id, this_week))
      ) order by m.joined_at), '[]'::jsonb)
      from public.team_members m
      join public.profiles p on p.id = m.user_id
      where m.team_id = t.id
    ),
    'invites', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', i.id,
        'name', p.name,
        'status', i.status
      ) order by i.created_at), '[]'::jsonb)
      from public.team_invites i
      join public.profiles p on p.id = i.invited_user_id
      where i.team_id = t.id and i.status in ('pending', 'accepted')
        and exists (select 1 from public.team_members m where m.team_id = t.id and m.user_id = uid)
    ),
    'weekDays', (
      select coalesce(jsonb_agg(round(coalesce(d.km, 0), 1) order by d.day), '[]'::jsonb)
      from (
        select g.day,
               (select sum(r.distance_m) / 1000.0 from public.runs r
                 where r.team_id = t.id and r.status = 'valid'
                   and r.started_at >= this_week + (g.day * interval '1 day')
                   and r.started_at < this_week + ((g.day + 1) * interval '1 day')) as km
          from generate_series(0, 6) as g(day)
      ) d
    )
  );
end;
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
        'points', greatest(0, coalesce((
          select sum(r.points) from public.runs r
           where r.user_id = p.id and r.team_id = mine.id and r.status = 'valid'
             and r.started_at >= this_week
        ), 0) + public.member_game_points(p.id, mine.id, this_week))
      ) order by m.joined_at), '[]'::jsonb)
      from public.team_members m
      join public.profiles p on p.id = m.user_id
      where m.team_id = mine.id
    )
  );
end;
$$;

create or replace function public.get_athlete_profile(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  p public.profiles;
  t public.teams;
  is_mate boolean;
  is_open boolean;
  this_week timestamptz := public.week_start();
begin
  select * into p from public.profiles where id = p_user_id;
  if p.id is null then
    return null;
  end if;
  select tt.* into t
    from public.teams tt join public.team_members m on m.team_id = tt.id
   where m.user_id = p.id;
  is_mate := p.id = uid or exists (
    select 1 from public.team_members a join public.team_members b on a.team_id = b.team_id
     where a.user_id = uid and b.user_id = p.id
  );
  is_open := is_mate or coalesce((p.privacy ->> 'publicProfile')::boolean, true);

  return jsonb_build_object(
    'id', p.id,
    'name', coalesce(nullif(p.name, ''), 'Atleta'),
    'handle', p.handle,
    'avatarPath', p.avatar_path,
    'isYou', p.id = uid,
    'isPrivate', not is_open,
    'city', case when is_open and (is_mate or coalesce((p.privacy ->> 'showCity')::boolean, true)) then p.city end,
    'state', case when is_open and (is_mate or coalesce((p.privacy ->> 'showCity')::boolean, true)) then p.state end,
    'team', case when t.id is null then null else jsonb_build_object(
      'id', t.id,
      'name', t.name,
      'logoUrl', t.logo_url,
      'size', t.size,
      'city', t.city,
      'position', public.team_city_position(t.id, this_week)
    ) end,
    'stats', case when not is_open then null else (
      select jsonb_build_object(
        'runs', count(*),
        'totalKm', round(coalesce(sum(r.distance_m), 0) / 1000.0, 1),
        'weekKm', round(coalesce(sum(r.distance_m) filter (where r.started_at >= this_week), 0) / 1000.0, 1),
        'weekPoints', greatest(0, coalesce(sum(r.points) filter (where r.started_at >= this_week), 0)
          + public.member_game_points(p.id, null, this_week))
      )
      from public.runs r where r.user_id = p.id and r.status = 'valid'
    ) end
  );
end;
$$;
