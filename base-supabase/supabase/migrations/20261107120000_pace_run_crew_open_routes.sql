-- Testes do build 37 (B37-5): corrida em grupo igual em todo lugar.
-- 1. Percursos sempre abertos para a equipe (eram escondidos por
--    "Compartilhar rotas" e cortados 150 m em cada ponta: um colega que
--    andou pouco sumia). Fora da equipe só vai o desenho (sem GPS).
-- 2. Distância exata (km com 3 casas: 6 m não vira mais 10 m).
-- 3. Uma lista só de quem correu junto (get_run_crew e o feed): todos, com o
--    desenho do percurso de cada um no mesmo referencial, nome, foto,
--    metros, tempo e se ainda está correndo.

-- 1. Percurso: todas as chamadas são da própria equipe ------------------------

create or replace function public.visible_route(p_run public.runs, p_viewer uuid)
returns jsonb
language sql
stable
security definer
set search_path to ''
as $$
  select coalesce(p_run.route, '[]'::jsonb);
$$;

-- 2. Corrida da equipe com km exato ---------------------------------------------

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
  saved jsonb;
  live jsonb;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  select * into r from public.runs where id = p_run_id;
  if r.id is null or (r.user_id <> uid and (my_team is null or r.team_id is distinct from my_team)) then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', o.user_id,
    'name', coalesce(nullif(p.name, ''), 'Atleta'),
    'avatarPath', p.avatar_path,
    'isYou', o.user_id = uid,
    'isLive', false,
    'km', round(o.distance_m / 1000.0, 3),
    'seconds', o.duration_s,
    'route', public.visible_route(o, uid)
  ) order by o.distance_m desc), '[]'::jsonb)
    into saved
    from public.runs o
    join public.profiles p on p.id = o.user_id
   where r.team_id is not null and o.team_id = r.team_id and o.id <> r.id
     and o.user_id <> r.user_id
     and o.started_at < r.finished_at + interval '10 minutes'
     and o.finished_at > r.started_at - interval '10 minutes';

  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', l.user_id,
    'name', coalesce(nullif(p.name, ''), 'Atleta'),
    'avatarPath', p.avatar_path,
    'isYou', l.user_id = uid,
    'isLive', true,
    'km', round((l.meters / 1000.0)::numeric, 3),
    'seconds', greatest(0, round(extract(epoch from (l.updated_at - l.started_at))))::int,
    'route', l.trail
  ) order by l.meters desc), '[]'::jsonb)
    into live
    from public.team_live_positions l
    join public.profiles p on p.id = l.user_id
   where r.team_id is not null and l.team_id = r.team_id
     and l.user_id <> r.user_id
     and l.updated_at > now() - interval '10 minutes'
     and l.started_at < r.finished_at + interval '10 minutes'
     and not exists (
       select 1 from public.runs o
        where o.user_id = l.user_id and o.team_id = r.team_id
          and o.started_at < r.finished_at + interval '10 minutes'
          and o.finished_at > r.started_at - interval '10 minutes'
     );

  return jsonb_build_object(
    'id', r.id,
    'userId', r.user_id,
    'name', (select coalesce(nullif(p.name, ''), 'Atleta') from public.profiles p where p.id = r.user_id),
    'avatarPath', (select p.avatar_path from public.profiles p where p.id = r.user_id),
    'isYou', r.user_id = uid,
    'startedAt', r.started_at,
    'seconds', r.duration_s,
    'km', round(r.distance_m / 1000.0, 3),
    'points', r.points,
    'status', r.status,
    'mode', r.mode,
    'route', public.visible_route(r, uid),
    'mates', saved || live
  );
end;
$$;
revoke all on function public.get_team_run(uuid) from public, anon;
grant execute on function public.get_team_run(uuid) to authenticated;

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
        'km', round(r.distance_m / 1000.0, 3),
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
revoke all on function public.get_team_runs(integer) from public, anon;
grant execute on function public.get_team_runs(integer) to authenticated;

-- 3. Quem correu junto, num referencial só ---------------------------------------

-- Todos que correram junto com a corrida p_run (o dono primeiro): desenho do
-- percurso de cada um em graus relativos a um ponto comum (o 1º ponto do
-- dono), sem coordenada de GPS. Solo (ou sem equipe): só o dono.
create or replace function public.run_crew_json(p_run public.runs, p_viewer uuid)
returns jsonb
language sql
stable
security definer
set search_path to ''
as $$
  with win as (
    select p_run.mode = 'team' and p_run.team_id is not null as together,
           p_run.started_at - interval '10 minutes' as from_at,
           coalesce(p_run.finished_at, p_run.started_at + make_interval(secs => p_run.duration_s))
             + interval '10 minutes' as to_at
  ),
  saved as (
    select distinct on (o.user_id) o.user_id, o.distance_m::float8 as meters, o.duration_s as seconds,
           coalesce(o.route, '[]'::jsonb) as route
      from public.runs o cross join win w
     where w.together and o.team_id = p_run.team_id and o.user_id <> p_run.user_id
       and o.started_at < w.to_at and o.finished_at > w.from_at
     order by o.user_id, o.distance_m desc
  ),
  people as (
    select p_run.user_id as user_id, false as is_live, p_run.distance_m::float8 as meters,
           p_run.duration_s as seconds, coalesce(p_run.route, '[]'::jsonb) as route, 0 as ord
    union all
    select s.user_id, false, s.meters, s.seconds, s.route, 1 from saved s
    union all
    select l.user_id, true, coalesce(l.meters, 0)::float8,
           greatest(0, round(extract(epoch from (l.updated_at - l.started_at))))::int,
           coalesce(l.trail, '[]'::jsonb), 2
      from public.team_live_positions l cross join win w
     where w.together and l.team_id = p_run.team_id and l.user_id <> p_run.user_id
       and l.updated_at > now() - interval '10 minutes'
       and l.started_at < w.to_at
       and not exists (select 1 from saved s where s.user_id = l.user_id)
  ),
  pts as (
    select pe.user_id, pe.ord, (t.e ->> 0)::float8 as lat, (t.e ->> 1)::float8 as lng, t.n,
           jsonb_array_length(pe.route) as total
      from people pe
      cross join lateral jsonb_array_elements(pe.route) with ordinality as t(e, n)
     where jsonb_typeof(t.e) = 'array'
  ),
  origin as (
    select p.lat as lat0, p.lng as lng0 from pts p order by p.ord, p.n limit 1
  ),
  shapes as (
    select p.user_id, jsonb_agg(jsonb_build_array(
             round((p.lat - o.lat0)::numeric, 6),
             round(((p.lng - o.lng0) * cos(radians(o.lat0)))::numeric, 6)
           ) order by p.n) as shape
      from pts p cross join origin o
     where (p.n - 1) % greatest(1, ceil(p.total / 300.0)::int) = 0 or p.n = p.total
     group by p.user_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'userId', pe.user_id,
      'name', coalesce(nullif(pr.name, ''), 'Atleta'),
      'avatarPath', pr.avatar_path,
      'isOwner', pe.ord = 0,
      'isYou', pe.user_id = p_viewer,
      'isLive', pe.is_live,
      'meters', round(pe.meters::numeric, 1),
      'seconds', pe.seconds,
      'shape', coalesce(s.shape, '[]'::jsonb)
    ) order by pe.ord, pe.meters desc), '[]'::jsonb)
    from people pe
    join public.profiles pr on pr.id = pe.user_id
    left join shapes s on s.user_id = pe.user_id;
$$;
revoke all on function public.run_crew_json(public.runs, uuid) from public, anon, authenticated;

-- Para o app: quem pode ver a corrida (o dono, a equipe ou quem vê o post
-- dela no feed) recebe a lista de quem correu junto
create or replace function public.get_run_crew(p_run_id uuid)
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
  select * into r from public.runs where id = p_run_id;
  if r.id is null then
    return null;
  end if;
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if r.user_id <> uid
     and (my_team is null or r.team_id is distinct from my_team)
     and not exists (select 1 from public.posts po where po.run_id = r.id) then
    return null;
  end if;
  return public.run_crew_json(r, uid);
end;
$$;
revoke all on function public.get_run_crew(uuid) from public, anon;
grant execute on function public.get_run_crew(uuid) to authenticated;

-- 4. Feed: o post de uma corrida em equipe traz a turma atual -----------------
-- (quem ainda corria quando o post foi feito aparece com os números finais)

create or replace function public.get_feed(p_limit integer default 30)
returns jsonb
language sql
security definer
set search_path to ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id,
    'authorId', f.user_id,
    'name', f.author,
    'avatarPath', f.avatar_path,
    'team', coalesce(f.team_name, ''),
    'teamId', f.team_id,
    'teamLogo', f.team_logo,
    'teamRank', f.team_rank,
    'scope', f.scope,
    'imagePath', f.image_path,
    'sample', f.sample,
    'seconds', coalesce(f.run_seconds, f.seconds),
    'km', coalesce(f.run_km, f.km),
    'route', f.route,
    'crew', coalesce(f.art_crew, '[]'::jsonb),
    'runId', f.run_id,
    'runCrew', f.run_crew,
    'layers', f.layers,
    'caption', f.caption,
    'createdAt', f.created_at,
    'likes', f.likes,
    'isLiked', f.is_liked,
    'isMine', f.user_id = (select auth.uid())
  ) order by f.created_at desc), '[]'::jsonb)
  from (
    select po.*,
           p.name as author,
           p.avatar_path,
           t.name as team_name,
           t.logo_url as team_logo,
           case when t.id is not null then public.team_city_position(t.id, public.week_start()) end as team_rank,
           r.duration_s as run_seconds,
           round(r.distance_m / 1000.0, 3) as run_km,
           case
             when po.art_route is not null then po.art_route
             when r.id is null or r.user_id <> po.user_id then '[]'::jsonb
             else public.route_shape(r.route)
           end as route,
           case
             when r.id is not null and r.mode = 'team' then public.run_crew_json(r, (select auth.uid()))
           end as run_crew,
           (select count(*) from public.post_likes l where l.post_id = po.id) as likes,
           exists (select 1 from public.post_likes l where l.post_id = po.id and l.user_id = (select auth.uid())) as is_liked
      from public.posts po
      join public.profiles p on p.id = po.user_id
      left join public.teams t on t.id = po.team_id
      left join public.runs r on r.id = po.run_id
     where not exists (
             select 1 from public.user_blocks b
              where (b.blocker_id = (select auth.uid()) and b.blocked_id = po.user_id)
                 or (b.blocker_id = po.user_id and b.blocked_id = (select auth.uid()))
           )
       and not exists (
             select 1 from public.post_reports rp
              where rp.post_id = po.id and rp.reporter_id = (select auth.uid())
           )
       and (
             po.user_id = (select auth.uid())
             or (select count(*) from public.post_reports rp where rp.post_id = po.id) < 3
           )
     order by po.created_at desc
     limit least(greatest(p_limit, 1), 100)
  ) f;
$$;
