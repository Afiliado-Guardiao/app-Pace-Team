-- Equipe em dupla (2 integrantes), país da equipe, edição pelo capitão e
-- foto dos integrantes. Os números de cada integrante passam a contar só as
-- corridas feitas como integrante da equipe (antes somavam todas as corridas
-- da semana e não batiam com os pontos e km da equipe).

alter table public.teams drop constraint if exists teams_size_check;
alter table public.teams add constraint teams_size_check check (size = any (array[2, 3, 5, 10]));

alter table public.teams add column if not exists country text not null default 'BR';
alter table public.teams drop constraint if exists teams_country_check;
alter table public.teams add constraint teams_country_check check (country ~ '^[A-Z]{2}$');

drop function if exists public.create_team(text, text, text, integer);

create or replace function public.create_team(
  p_name text,
  p_city text,
  p_region text,
  p_size integer,
  p_country text default 'BR'
)
returns uuid
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  new_id uuid;
begin
  if exists (select 1 from public.team_members where user_id = uid) then
    raise exception 'already_in_team';
  end if;

  insert into public.teams (name, city, region, state, size, country, captain_id)
  values (
    trim(p_name),
    trim(p_city),
    nullif(trim(p_region), ''),
    (select p.state from public.profiles p where p.id = uid),
    p_size,
    upper(coalesce(nullif(trim(p_country), ''), 'BR')),
    uid
  )
  returning id into new_id;

  insert into public.team_members (team_id, user_id, role) values (new_id, uid, 'captain');
  return new_id;
end;
$$;

-- Capitão muda nome, cidade, região, país e categoria. A categoria não pode
-- ficar menor que o número de integrantes que já estão na equipe.
create or replace function public.update_team(
  p_name text,
  p_city text,
  p_region text,
  p_size integer,
  p_country text default 'BR'
)
returns uuid
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  members bigint;
begin
  select t.id into my_team from public.teams t where t.captain_id = uid;
  if my_team is null then
    raise exception 'not_captain';
  end if;

  select count(*) into members from public.team_members m where m.team_id = my_team;
  if p_size < members then
    raise exception 'team_too_small';
  end if;

  update public.teams
     set name = trim(p_name),
         city = trim(p_city),
         region = nullif(trim(p_region), ''),
         size = p_size,
         country = upper(coalesce(nullif(trim(p_country), ''), 'BR'))
   where id = my_team;

  return my_team;
end;
$$;

revoke all on function public.create_team(text, text, text, integer, text) from public, anon;
grant execute on function public.create_team(text, text, text, integer, text) to authenticated;
revoke all on function public.update_team(text, text, text, integer, text) from public, anon;
grant execute on function public.update_team(text, text, text, integer, text) to authenticated;

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
        'points', coalesce((
          select sum(r.points) from public.runs r
           where r.user_id = p.id and r.team_id = t.id and r.status = 'valid'
             and r.started_at >= this_week
        ), 0)
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

create or replace function public.get_team_last_runs()
returns jsonb
language plpgsql
security definer
set search_path to ''
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
        'avatarPath', p.avatar_path,
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
