-- =============================================================================
-- PACE TEAM · funcoes RPC (equipes, convites, ranking, feed e estatisticas)
-- -----------------------------------------------------------------------------
-- Todas security definer com search_path vazio, checam auth.uid() e devolvem
-- jsonb em camelCase para o app consumir direto.
-- =============================================================================

-- Exige sessao e devolve o uid.
create or replace function public.require_uid()
returns uuid
language plpgsql
stable
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;
  return uid;
end;
$$;

-- -----------------------------------------------------------------------------
-- Equipe: criar, entrar pelo codigo, sair
-- -----------------------------------------------------------------------------
create or replace function public.create_team(
  p_name text,
  p_city text,
  p_region text,
  p_size int
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  new_id uuid;
begin
  if exists (select 1 from public.team_members where user_id = uid) then
    raise exception 'already_in_team';
  end if;

  insert into public.teams (name, city, region, state, size, captain_id)
  values (
    trim(p_name),
    trim(p_city),
    nullif(trim(p_region), ''),
    (select p.state from public.profiles p where p.id = uid),
    p_size,
    uid
  )
  returning id into new_id;

  insert into public.team_members (team_id, user_id, role) values (new_id, uid, 'captain');
  return new_id;
end;
$$;

-- Entra numa equipe (convite aceito ou codigo); respeita o limite de vagas.
create or replace function public.join_team(p_team_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  capacity int;
  members int;
begin
  if exists (select 1 from public.team_members where user_id = uid) then
    raise exception 'already_in_team';
  end if;

  select t.size into capacity from public.teams t where t.id = p_team_id for update;
  if capacity is null then
    raise exception 'team_not_found';
  end if;

  select count(*) into members from public.team_members where team_id = p_team_id;
  if members >= capacity then
    raise exception 'team_full';
  end if;

  insert into public.team_members (team_id, user_id) values (p_team_id, uid);
  update public.team_invites
     set status = 'accepted', responded_at = now()
   where team_id = p_team_id and invited_user_id = uid and status = 'pending';
end;
$$;

create or replace function public.join_team_by_code(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
begin
  perform public.require_uid();
  select t.id into target from public.teams t where t.invite_code = upper(trim(p_code));
  if target is null then
    raise exception 'team_not_found';
  end if;
  perform public.join_team(target);
  return target;
end;
$$;

-- Sai da equipe. O capitao passa a faixa para o integrante mais antigo; a
-- equipe vazia e apagada.
create or replace function public.leave_team()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  my_role text;
  heir uuid;
begin
  select tm.team_id, tm.role into my_team, my_role
    from public.team_members tm where tm.user_id = uid;
  if my_team is null then
    return;
  end if;

  delete from public.team_members where user_id = uid;

  if my_role = 'captain' then
    select tm.user_id into heir
      from public.team_members tm
     where tm.team_id = my_team
     order by tm.joined_at
     limit 1;

    if heir is null then
      delete from public.teams where id = my_team;
    else
      update public.team_members set role = 'captain' where team_id = my_team and user_id = heir;
      update public.teams set captain_id = heir where id = my_team;
    end if;
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Convites
-- -----------------------------------------------------------------------------
create or replace function public.invite_to_team(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  capacity int;
  taken int;
begin
  select tm.team_id into my_team from public.team_members tm where tm.user_id = uid;
  if my_team is null then
    raise exception 'no_team';
  end if;
  if p_user_id = uid then
    raise exception 'invalid_user';
  end if;

  select t.size into capacity from public.teams t where t.id = my_team;
  select (select count(*) from public.team_members where team_id = my_team)
       + (select count(*) from public.team_invites where team_id = my_team and status = 'pending')
    into taken;
  if taken >= capacity then
    raise exception 'team_full';
  end if;

  insert into public.team_invites (team_id, invited_user_id, invited_by)
  values (my_team, p_user_id, uid)
  on conflict (team_id, invited_user_id)
  do update set status = 'pending', invited_by = uid, created_at = now(), responded_at = null;
end;
$$;

create or replace function public.respond_invite(p_invite_id uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  inv_team uuid;
begin
  select i.team_id into inv_team
    from public.team_invites i
   where i.id = p_invite_id and i.invited_user_id = uid and i.status = 'pending';
  if inv_team is null then
    raise exception 'invite_not_found';
  end if;

  if p_accept then
    perform public.join_team(inv_team);
  else
    update public.team_invites set status = 'declined', responded_at = now() where id = p_invite_id;
  end if;
end;
$$;

-- Convites pendentes que eu recebi.
create or replace function public.get_my_invites()
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id,
    'teamId', t.id,
    'teamName', t.name,
    'city', t.city,
    'size', t.size,
    'members', (select count(*) from public.team_members m where m.team_id = t.id)
  ) order by i.created_at desc), '[]'::jsonb)
  from public.team_invites i
  join public.teams t on t.id = i.team_id
  where i.invited_user_id = (select auth.uid()) and i.status = 'pending';
$$;

-- Busca atletas para convidar (nome ou @), sem expor dados privados.
create or replace function public.search_athletes(p_query text)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'handle', coalesce('@' || p.handle, p.city, ''),
    'hasTeam', exists (select 1 from public.team_members m where m.user_id = p.id)
  )), '[]'::jsonb)
  from (
    select * from public.profiles p
     where p.id <> (select auth.uid())
       and p.name <> ''
       and (
         coalesce(trim(p_query), '') = ''
         or p.name ilike '%' || trim(p_query) || '%'
         or p.handle ilike '%' || ltrim(trim(p_query), '@') || '%'
       )
     order by p.created_at desc
     limit 12
  ) p;
$$;

-- -----------------------------------------------------------------------------
-- Pontos da semana por equipe e ranking
-- -----------------------------------------------------------------------------

-- Pontos e km validados de cada equipe numa semana.
create or replace function public.team_week_totals(p_week timestamptz)
returns table (team_id uuid, points bigint, km numeric)
language sql
stable
security definer
set search_path = ''
as $$
  select t.id,
         coalesce(sum(r.points), 0),
         coalesce(sum(r.distance_m) filter (where r.status = 'valid'), 0) / 1000.0
    from public.teams t
    left join public.runs r
      on r.team_id = t.id
     and r.status = 'valid'
     and r.started_at >= p_week
     and r.started_at < p_week + interval '7 days'
   group by t.id;
$$;

-- Ranking semanal por categoria (3, 5 ou 10) e escopo geografico.
-- p_scope: city | region | state | country (o filtro usa a minha equipe).
create or replace function public.get_team_ranking(p_size int, p_scope text default 'city')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  mine public.teams;
  this_week timestamptz := public.week_start();
  result jsonb;
begin
  select t.* into mine
    from public.teams t
    join public.team_members m on m.team_id = t.id
   where m.user_id = uid;

  with base as (
    select t.*,
           cur.points as week_points,
           cur.km as week_km,
           prev.points as prev_points
      from public.teams t
      join public.team_week_totals(this_week) cur on cur.team_id = t.id
      join public.team_week_totals(this_week - interval '7 days') prev on prev.team_id = t.id
     where t.size = p_size
       and (
         p_scope = 'country'
         or mine.id is null
         or (p_scope = 'city' and t.city = mine.city)
         or (p_scope = 'region' and coalesce(t.region, t.city) = coalesce(mine.region, mine.city))
         or (p_scope = 'state' and coalesce(t.state, '') = coalesce(mine.state, ''))
       )
  ),
  ranked as (
    select b.*,
           rank() over (order by b.week_points desc, b.week_km desc, b.created_at) as pos,
           rank() over (order by b.prev_points desc, b.created_at) as prev_pos
      from base b
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'name', r.name,
    'city', r.city,
    'points', r.week_points,
    'km', round(r.week_km, 1),
    'position', r.pos,
    'delta', r.prev_pos - r.pos,
    'logoUrl', r.logo_url,
    'isYou', r.id = mine.id,
    'members', (select count(*) from public.team_members m where m.team_id = r.id)
  ) order by r.pos), '[]'::jsonb)
  into result
  from ranked r;

  return result;
end;
$$;

-- -----------------------------------------------------------------------------
-- Minha equipe (aba Equipe, Inicio) e detalhes de qualquer equipe
-- -----------------------------------------------------------------------------
create or replace function public.get_team(p_team_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
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
        'role', m.role,
        'isYou', p.id = uid,
        'km', round(coalesce((
          select sum(r.distance_m) from public.runs r
           where r.user_id = p.id and r.status = 'valid' and r.started_at >= this_week
        ), 0) / 1000.0, 1),
        'points', coalesce((
          select sum(r.points) from public.runs r
           where r.user_id = p.id and r.status = 'valid' and r.started_at >= this_week
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

create or replace function public.get_my_team()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null then
    return null;
  end if;
  return public.get_team(my_team);
end;
$$;

-- -----------------------------------------------------------------------------
-- Estatisticas do atleta (Inicio e Perfil)
-- -----------------------------------------------------------------------------
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
      'weekPoints', coalesce(sum(r.points) filter (where r.started_at >= this_week), 0),
      'weekRuns', count(*) filter (where r.started_at >= this_week),
      'monthKm', round(coalesce(sum(r.distance_m) filter (where r.status = 'valid' and r.started_at >= month_start), 0) / 1000.0, 1),
      'monthRuns', count(*) filter (where r.started_at >= month_start),
      'monthPoints', coalesce(sum(r.points) filter (where r.started_at >= month_start), 0),
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

-- -----------------------------------------------------------------------------
-- Feed
-- -----------------------------------------------------------------------------
create or replace function public.get_feed(p_limit int default 30)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id,
    'name', f.author,
    'team', coalesce(f.team_name, ''),
    'teamId', f.team_id,
    'imagePath', f.image_path,
    'sample', f.sample,
    'seconds', f.seconds,
    'km', f.km,
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
           t.name as team_name,
           (select count(*) from public.post_likes l where l.post_id = po.id) as likes,
           exists (select 1 from public.post_likes l where l.post_id = po.id and l.user_id = (select auth.uid())) as is_liked
      from public.posts po
      join public.profiles p on p.id = po.user_id
      left join public.teams t on t.id = po.team_id
     order by po.created_at desc
     limit least(greatest(p_limit, 1), 100)
  ) f;
$$;

-- -----------------------------------------------------------------------------
-- Permissoes
-- -----------------------------------------------------------------------------
revoke execute on function public.team_week_totals(timestamptz) from public, anon;
revoke execute on function public.require_uid() from public, anon;

grant execute on function public.create_team(text, text, text, int)    to authenticated;
grant execute on function public.join_team(uuid)                       to authenticated;
grant execute on function public.join_team_by_code(text)               to authenticated;
grant execute on function public.leave_team()                          to authenticated;
grant execute on function public.invite_to_team(uuid)                  to authenticated;
grant execute on function public.respond_invite(uuid, boolean)         to authenticated;
grant execute on function public.get_my_invites()                      to authenticated;
grant execute on function public.search_athletes(text)                 to authenticated;
grant execute on function public.get_team_ranking(int, text)           to authenticated;
grant execute on function public.get_team(uuid)                        to authenticated;
grant execute on function public.get_my_team()                         to authenticated;
grant execute on function public.get_my_stats()                        to authenticated;
grant execute on function public.get_feed(int)                         to authenticated;
grant execute on function public.require_uid()                         to authenticated;
grant execute on function public.team_week_totals(timestamptz)         to authenticated;

revoke execute on function public.create_team(text, text, text, int)    from public, anon;
revoke execute on function public.join_team(uuid)                       from public, anon;
revoke execute on function public.join_team_by_code(text)               from public, anon;
revoke execute on function public.leave_team()                          from public, anon;
revoke execute on function public.invite_to_team(uuid)                  from public, anon;
revoke execute on function public.respond_invite(uuid, boolean)         from public, anon;
revoke execute on function public.get_my_invites()                      from public, anon;
revoke execute on function public.search_athletes(text)                 from public, anon;
revoke execute on function public.get_team_ranking(int, text)           from public, anon;
revoke execute on function public.get_team(uuid)                        from public, anon;
revoke execute on function public.get_my_team()                         from public, anon;
revoke execute on function public.get_my_stats()                        from public, anon;
revoke execute on function public.get_feed(int)                         from public, anon;
