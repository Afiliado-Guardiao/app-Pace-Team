-- Corridas da equipe (histórico e detalhe), posição ao vivo de quem corre
-- junto, Buddy de cada colega online e aviso de corrida que abre a corrida.
-- O percurso de um colega só sai daqui se ele ligou "Compartilhar rotas com
-- a equipe" (privacy.shareRoutes); com "Ocultar início e fim das rotas"
-- (privacy.hideRouteEnds), os primeiros e os últimos 150 m são cortados.

-- Corta `p_meters` do começo e do fim do percurso ([[lat, lng], ...])
create or replace function public.trim_route_ends(p_route jsonb, p_meters numeric)
returns jsonb
language plpgsql
immutable
set search_path to ''
as $$
declare
  n int := coalesce(jsonb_array_length(p_route), 0);
  dist numeric[] := array[0]::numeric[];
  total numeric := 0;
  i int;
  lat1 float8; lng1 float8; lat2 float8; lng2 float8;
  h float8;
  result jsonb := '[]'::jsonb;
begin
  if n < 2 then
    return '[]'::jsonb;
  end if;
  for i in 1 .. n - 1 loop
    lat1 := radians((p_route -> (i - 1) ->> 0)::float8);
    lng1 := radians((p_route -> (i - 1) ->> 1)::float8);
    lat2 := radians((p_route -> i ->> 0)::float8);
    lng2 := radians((p_route -> i ->> 1)::float8);
    h := sin((lat2 - lat1) / 2) ^ 2 + cos(lat1) * cos(lat2) * sin((lng2 - lng1) / 2) ^ 2;
    total := total + 2 * 6371000 * asin(least(1, sqrt(h)));
    dist := dist || total;
  end loop;
  if total <= p_meters * 2 then
    return '[]'::jsonb;
  end if;
  for i in 0 .. n - 1 loop
    if dist[i + 1] >= p_meters and dist[i + 1] <= total - p_meters then
      result := result || jsonb_build_array(p_route -> i);
    end if;
  end loop;
  return result;
end;
$$;

-- Percurso que `p_viewer` pode ver da corrida `p_run` (dono vê tudo)
create or replace function public.visible_route(p_run public.runs, p_viewer uuid)
returns jsonb
language sql
stable
security definer
set search_path to ''
as $$
  select case
    when p_run.user_id = p_viewer then p_run.route
    when not coalesce((p.privacy ->> 'shareRoutes')::boolean, false) then '[]'::jsonb
    when coalesce((p.privacy ->> 'hideRouteEnds')::boolean, true)
      then public.trim_route_ends(p_run.route, 150)
    else p_run.route
  end
  from public.profiles p
  where p.id = p_run.user_id;
$$;

revoke all on function public.visible_route(public.runs, uuid) from public, anon, authenticated;

-- Corridas da minha equipe (mais recentes primeiro), com o percurso permitido
create or replace function public.get_team_runs(p_limit integer default 40)
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null then
    return '[]'::jsonb;
  end if;

  return (
    select coalesce(jsonb_agg(x.item order by x.started_at desc), '[]'::jsonb)
    from (
      select r.started_at, jsonb_build_object(
        'id', r.id,
        'userId', r.user_id,
        'name', coalesce(nullif(p.name, ''), 'Atleta'),
        'avatarPath', p.avatar_path,
        'isYou', r.user_id = uid,
        'startedAt', r.started_at,
        'seconds', r.duration_s,
        'km', round(r.distance_m / 1000.0, 2),
        'points', r.points,
        'status', r.status,
        'mode', r.mode,
        'route', public.visible_route(r, uid)
      ) as item
      from public.runs r
      join public.profiles p on p.id = r.user_id
      where r.team_id = my_team
      order by r.started_at desc
      limit least(greatest(p_limit, 1), 100)
    ) x
  );
end;
$$;

-- Uma corrida da equipe (aviso "fulano concluiu uma corrida") e quem correu
-- junto no mesmo horário (a foto de cada um vai no fim do percurso dele)
create or replace function public.get_team_run(p_run_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  r public.runs;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  select * into r from public.runs where id = p_run_id;
  if r.id is null or (r.user_id <> uid and (my_team is null or r.team_id is distinct from my_team)) then
    return null;
  end if;

  return jsonb_build_object(
    'id', r.id,
    'userId', r.user_id,
    'name', (select coalesce(nullif(p.name, ''), 'Atleta') from public.profiles p where p.id = r.user_id),
    'avatarPath', (select p.avatar_path from public.profiles p where p.id = r.user_id),
    'isYou', r.user_id = uid,
    'startedAt', r.started_at,
    'seconds', r.duration_s,
    'km', round(r.distance_m / 1000.0, 2),
    'points', r.points,
    'status', r.status,
    'mode', r.mode,
    'route', public.visible_route(r, uid),
    'mates', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'userId', o.user_id,
        'name', coalesce(nullif(p.name, ''), 'Atleta'),
        'avatarPath', p.avatar_path,
        'isYou', o.user_id = uid,
        'km', round(o.distance_m / 1000.0, 2),
        'seconds', o.duration_s,
        'route', public.visible_route(o, uid)
      ) order by o.distance_m desc), '[]'::jsonb)
      from public.runs o
      join public.profiles p on p.id = o.user_id
      where r.team_id is not null and o.team_id = r.team_id and o.id <> r.id
        and o.user_id <> r.user_id
        and o.started_at < r.finished_at + interval '10 minutes'
        and o.finished_at > r.started_at - interval '10 minutes'
    )
  );
end;
$$;

revoke all on function public.get_team_runs(integer) from public, anon;
grant execute on function public.get_team_runs(integer) to authenticated;
revoke all on function public.get_team_run(uuid) from public, anon;
grant execute on function public.get_team_run(uuid) to authenticated;

-- Posição ao vivo de quem está correndo com a equipe (só a última, apagada
-- ao terminar). Ninguém lê a tabela direto: só pelas funções abaixo.
create table if not exists public.team_live_positions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  updated_at timestamptz not null default now()
);

alter table public.team_live_positions enable row level security;
revoke all on public.team_live_positions from anon, authenticated;

create or replace function public.set_live_position(p_lat double precision, p_lng double precision)
returns void
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null or p_lat not between -90 and 90 or p_lng not between -180 and 180 then
    return;
  end if;
  insert into public.team_live_positions (user_id, team_id, lat, lng, updated_at)
  values (uid, my_team, p_lat, p_lng, now())
  on conflict (user_id) do update
    set team_id = excluded.team_id, lat = excluded.lat, lng = excluded.lng, updated_at = now();
end;
$$;

create or replace function public.clear_live_position()
returns void
language sql
security definer
set search_path to ''
as $$
  delete from public.team_live_positions where user_id = (select auth.uid());
$$;

-- Colegas correndo agora (posição dos últimos 2 min), com nome e foto
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
    and l.updated_at > now() - interval '2 minutes';
$$;

revoke all on function public.set_live_position(double precision, double precision) from public, anon;
grant execute on function public.set_live_position(double precision, double precision) to authenticated;
revoke all on function public.clear_live_position() from public, anon;
grant execute on function public.clear_live_position() to authenticated;
revoke all on function public.get_team_live_positions() from public, anon;
grant execute on function public.get_team_live_positions() to authenticated;

-- Colegas online com o Buddy de cada um (cor e acessórios do app dele) e foto
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
    select pp.user_id, pp.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped,
           max(pp.at) as last_seen
      from public.team_presence_pings pp
      join public.team_members me on me.team_id = pp.team_id and me.user_id = (select auth.uid())
      join public.team_members tm on tm.team_id = pp.team_id and tm.user_id = pp.user_id
      join public.profiles p on p.id = pp.user_id
      left join public.buddy_profiles b on b.user_id = pp.user_id
     where pp.user_id <> (select auth.uid())
       and pp.at > now() - interval '15 minutes'
     group by pp.user_id, pp.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped
  ) x;
$$;

-- "Fulano concluiu uma corrida" agora abre a corrida (link team_run + runId)
alter table public.notifications drop constraint if exists notifications_link_check;
alter table public.notifications add constraint notifications_link_check
  check (link = any (array['disputa', 'team', 'challenges', 'ranking', 'team_run']));

create or replace function public.notify_run_team(p_run public.runs, p_author text)
returns void
language plpgsql
security definer
set search_path to ''
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

  perform public.notify(tm.user_id, 'team_run', 'footprints', 'neutral',
    p_author || ' concluiu uma corrida',
    public.fmt_km(p_run.distance_m) || ' km · +' || p_run.points || ' pts para o time',
    'team_run', jsonb_build_object('runId', p_run.id), null)
    from public.team_members tm
   where tm.team_id = t.id and tm.user_id <> p_run.user_id;

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

-- Push "fulano concluiu uma corrida" (Edge Function team-run-push). Só o
-- autor da corrida pede, uma vez por corrida, até 1 h depois de terminar.
alter table public.runs add column if not exists pushed_at timestamptz;

create or replace function public.team_run_push_targets(p_run_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  r public.runs;
  author text;
begin
  update public.runs
     set pushed_at = now()
   where id = p_run_id and user_id = uid and pushed_at is null
     and status = 'valid' and team_id is not null
     and coalesce(finished_at, created_at) > now() - interval '1 hour'
  returning * into r;
  if r.id is null then
    return jsonb_build_object('recipients', '[]'::jsonb);
  end if;

  select coalesce(nullif(p.name, ''), 'Atleta') into author from public.profiles p where p.id = uid;

  return jsonb_build_object(
    'runId', r.id,
    'title', author || ' concluiu uma corrida',
    'body', public.fmt_km(r.distance_m) || ' km · +' || r.points || ' pts para o time',
    'recipients', (
      select coalesce(jsonb_agg(jsonb_build_object('userId', d.user_id, 'token', d.token)), '[]'::jsonb)
        from public.team_members tm
        join public.device_tokens d on d.user_id = tm.user_id
       where tm.team_id = r.team_id and tm.user_id <> uid
    )
  );
end;
$$;

revoke all on function public.team_run_push_targets(uuid) from public, anon;
grant execute on function public.team_run_push_targets(uuid) to authenticated;
