-- Feed com foto do autor, escudo e posição da equipe, percurso real da
-- corrida e números exatos; post pessoal ou da equipe; perfil do atleta;
-- aviso "sua equipe está correndo" e o aviso de online só quando o atleta
-- vai usar de verdade (começou a correr ou ficou 5 min no app).

-- Post pessoal (no perfil) ou da equipe (foto do grupo, com o escudo)
alter table public.posts add column if not exists scope text not null default 'personal';
alter table public.posts drop constraint if exists posts_scope_check;
alter table public.posts add constraint posts_scope_check check (scope in ('personal', 'team'));
grant insert (scope) on public.posts to authenticated;

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
    -- Números da corrida em si (o post guardava a distância arredondada)
    'seconds', coalesce(f.run_seconds, f.seconds),
    'km', coalesce(f.run_km, f.km),
    'route', f.route,
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
           -- Percurso só da corrida do próprio autor, com o início e o fim
           -- cortados se ele escolheu esconder (privacy.hideRouteEnds)
           case
             when r.id is null or r.user_id <> po.user_id then '[]'::jsonb
             when coalesce((p.privacy ->> 'hideRouteEnds')::boolean, true)
               then public.trim_route_ends(r.route, 150)
             else r.route
           end as route,
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

-- Perfil de outro atleta (tocar no nome ou na foto no feed). Perfil fechado
-- (privacy.publicProfile = false) só mostra tudo para a própria equipe.
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
        'weekPoints', coalesce(sum(r.points) filter (where r.started_at >= this_week), 0)
      )
      from public.runs r where r.user_id = p.id and r.status = 'valid'
    ) end
  );
end;
$$;

revoke all on function public.get_athlete_profile(uuid) from public, anon;
grant execute on function public.get_athlete_profile(uuid) to authenticated;

-- Online: o app registra a presença ao abrir (bolinha verde), mas o push
-- "fulano está online" só sai quando p_notify = true (começou a correr ou
-- ficou 5 min com o app aberto)
drop function if exists public.buddy_ping_online();

create or replace function public.buddy_ping_online(p_notify boolean default true)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  my_name text;
  recipients jsonb;
begin
  select tm.team_id into my_team from public.team_members tm where tm.user_id = uid;
  select p.name into my_name from public.profiles p where p.id = uid;

  if my_team is null then
    return jsonb_build_object('userId', uid, 'name', coalesce(my_name, ''), 'teamId', null, 'recipients', '[]'::jsonb);
  end if;

  insert into public.team_presence_pings (user_id, team_id) values (uid, my_team);

  if not p_notify then
    return jsonb_build_object('userId', uid, 'name', coalesce(my_name, ''), 'teamId', my_team, 'recipients', '[]'::jsonb);
  end if;

  -- Upsert condicional: só devolve quem não recebeu aviso há 2 h.
  with mates as (
    select distinct tm.user_id
      from public.team_members tm
      join public.device_tokens d on d.user_id = tm.user_id
     where tm.team_id = my_team and tm.user_id <> uid
  ),
  sent as (
    insert into public.buddy_notify_throttle as t (from_user, to_user, last_sent_at)
    select uid, m.user_id, now() from mates m
    on conflict (from_user, to_user)
    do update set last_sent_at = excluded.last_sent_at
     where t.last_sent_at < now() - interval '2 hours'
    returning t.to_user
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', s.to_user,
    'name', p.name,
    'token', d.token
  ) order by p.name), '[]'::jsonb)
  into recipients
  from sent s
  join public.profiles p on p.id = s.to_user
  join public.device_tokens d on d.user_id = s.to_user;

  return jsonb_build_object('userId', uid, 'name', coalesce(my_name, ''), 'teamId', my_team, 'recipients', recipients);
end;
$$;

revoke all on function public.buddy_ping_online(boolean) from public, anon;
grant execute on function public.buddy_ping_online(boolean) to authenticated;

-- "Sua equipe está correndo, só falta você!": quem começa a correr com a
-- equipe avisa os colegas que não estão correndo agora. Cada colega recebe
-- no máximo 1 aviso desses a cada 45 min.
create table if not exists public.team_run_start_throttle (
  to_user uuid primary key references public.profiles (id) on delete cascade,
  last_sent_at timestamptz not null default now()
);

alter table public.team_run_start_throttle enable row level security;
revoke all on public.team_run_start_throttle from anon, authenticated;

create or replace function public.team_run_start_targets()
returns jsonb
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  my_name text;
  recipients jsonb;
begin
  select tm.team_id into my_team from public.team_members tm where tm.user_id = uid;
  if my_team is null then
    return jsonb_build_object('recipients', '[]'::jsonb);
  end if;
  select coalesce(nullif(p.name, ''), 'Seu colega') into my_name from public.profiles p where p.id = uid;

  with mates as (
    select distinct tm.user_id
      from public.team_members tm
      join public.device_tokens d on d.user_id = tm.user_id
     where tm.team_id = my_team and tm.user_id <> uid
       and not exists (
         select 1 from public.team_live_positions l
          where l.user_id = tm.user_id and l.updated_at > now() - interval '2 minutes'
       )
  ),
  sent as (
    insert into public.team_run_start_throttle as t (to_user, last_sent_at)
    select m.user_id, now() from mates m
    on conflict (to_user)
    do update set last_sent_at = excluded.last_sent_at
     where t.last_sent_at < now() - interval '45 minutes'
    returning t.to_user
  )
  select coalesce(jsonb_agg(jsonb_build_object('userId', s.to_user, 'token', d.token)), '[]'::jsonb)
    into recipients
    from sent s
    join public.device_tokens d on d.user_id = s.to_user;

  return jsonb_build_object('name', my_name, 'recipients', recipients);
end;
$$;

revoke all on function public.team_run_start_targets() from public, anon;
grant execute on function public.team_run_start_targets() to authenticated;
