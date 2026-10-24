-- =============================================================================
-- PACE TEAM · notificações, desafios, medalhas e conquistas com dados reais
-- -----------------------------------------------------------------------------
-- Nada existente muda (só tabela, funções e triggers novos).
-- - notifications: avisos de cada atleta, criados pelo banco:
--     * colega concluiu uma corrida, ultrapassagem no ranking da cidade
--       (para os dois lados), meta coletiva da semana batida, convite de
--       equipe, desafio concluído / medalha / recorde de 5 km
--     * "resultado semanal" criado na primeira abertura depois que a semana
--       fecha (sem agendador)
--   O atleta lê, marca como lida e apaga só os próprios avisos.
-- - get_my_challenges(): progresso dos desafios e medalhas do atleta.
-- - get_team_achievements(): conquistas da equipe (Top 5, semanas seguidas,
--   1.000 km e recorde semanal).
-- Regras: semana do ranking (segunda a domingo, São Paulo); meta individual
-- 40 km e 5 treinos; meta coletiva 50 km por vaga; tempo de 5 km estimado
-- pelo ritmo médio de corridas de 5 km ou mais.
-- =============================================================================

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  kind       text not null check (kind in (
               'team_run', 'overtook', 'overtaken', 'team_goal', 'invite',
               'weekly_result', 'medal', 'challenge'
             )),
  icon       text not null,
  tone       text not null check (tone in ('danger', 'accent', 'success', 'neutral')),
  title      text not null,
  sub        text not null default '',
  link       text check (link in ('disputa', 'team', 'challenges', 'ranking')),
  data       jsonb not null default '{}'::jsonb,
  -- Evita aviso repetido (ex.: "weekly:<equipe>:<semana>"); null = sempre cria
  dedupe_key text,
  created_at timestamptz not null default now(),
  read_at    timestamptz,
  unique (user_id, dedupe_key)
);

create index notifications_user_created_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

revoke all on public.notifications from anon, authenticated;
grant select, delete on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

create policy "notifications_select_own" on public.notifications
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "notifications_delete_own" on public.notifications
  for delete to authenticated using ((select auth.uid()) = user_id);

-- -----------------------------------------------------------------------------
-- Helpers internos
-- -----------------------------------------------------------------------------

-- 8432 m → "8,4"
create or replace function public.fmt_km(p_meters numeric)
returns text
language sql
immutable
set search_path = ''
as $$
  select replace(to_char(round(p_meters / 1000.0, 1), 'FM9999990.0'), '.', ',');
$$;

-- 1420 s → 23'40"
create or replace function public.fmt_clock(p_seconds numeric)
returns text
language sql
immutable
set search_path = ''
as $$
  select floor(p_seconds / 60)::int || '''' || lpad((floor(p_seconds)::int % 60)::text, 2, '0') || '"';
$$;

create or replace function public.notify(
  p_user uuid, p_kind text, p_icon text, p_tone text, p_title text,
  p_sub text, p_link text, p_data jsonb, p_key text
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notifications (user_id, kind, icon, tone, title, sub, link, data, dedupe_key)
  values (p_user, p_kind, p_icon, p_tone, p_title, coalesce(p_sub, ''), p_link, coalesce(p_data, '{}'::jsonb), p_key)
  on conflict (user_id, dedupe_key) do nothing;
$$;

-- Avisa todos os integrantes de uma equipe (menos p_except).
create or replace function public.notify_team(
  p_team uuid, p_except uuid, p_kind text, p_icon text, p_tone text,
  p_title text, p_sub text, p_link text, p_key text
)
returns void
language sql
security definer
set search_path = ''
as $$
  select public.notify(tm.user_id, p_kind, p_icon, p_tone, p_title, p_sub, p_link, '{}'::jsonb, p_key)
    from public.team_members tm
   where tm.team_id = p_team and tm.user_id is distinct from p_except;
$$;

-- Posição de uma equipe no ranking da cidade numa semana (mesma categoria).
create or replace function public.team_city_position(p_team uuid, p_week timestamptz)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  with t as (select * from public.teams where id = p_team),
       w as (select * from public.team_week_totals(p_week))
  select (count(*) + 1)::int
    from public.teams o
    join w on w.team_id = o.id
    join t on o.size = t.size and o.city = t.city
   where w.points > coalesce((select w2.points from w w2 where w2.team_id = p_team), 0);
$$;

-- Semanas seguidas com pelo menos uma corrida válida, até a semana atual
-- (ou até a passada, se ninguém correu ainda nesta semana).
create or replace function public.team_week_streak(p_team uuid)
returns int
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  wk timestamptz := public.week_start();
  n int := 0;
begin
  if not exists (
    select 1 from public.runs r
     where r.team_id = p_team and r.status = 'valid' and r.started_at >= wk
  ) then
    wk := wk - interval '7 days';
  end if;
  loop
    exit when n >= 520 or not exists (
      select 1 from public.runs r
       where r.team_id = p_team and r.status = 'valid'
         and r.started_at >= wk and r.started_at < wk + interval '7 days'
    );
    n := n + 1;
    wk := wk - interval '7 days';
  end loop;
  return n;
end;
$$;

-- Maior sequência de semanas seguidas com corrida (conquista "8 sem.").
create or replace function public.team_max_streak(p_team uuid)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(max(x.cnt), 0)::int
    from (
      select count(*) as cnt
        from (
          select w.idx, w.idx - row_number() over (order by w.idx) as grp
            from (
              select distinct floor(extract(epoch from public.week_start(r.started_at)) / 604800)::bigint as idx
                from public.runs r
               where r.team_id = p_team and r.status = 'valid'
            ) w
        ) g
       group by g.grp
    ) x;
$$;

-- A equipe terminou alguma semana fechada no Top 5 da cidade (com pontos)?
create or replace function public.team_was_top5(p_team uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  wk timestamptz;
begin
  for wk in
    select distinct public.week_start(r.started_at)
      from public.runs r
     where r.team_id = p_team and r.status = 'valid' and r.started_at < public.week_start()
  loop
    if public.team_week_points(p_team, wk) > 0 and public.team_city_position(p_team, wk) <= 5 then
      return true;
    end if;
  end loop;
  return false;
end;
$$;

-- Medalhas do atleta (ids usados pelo app).
create or replace function public.athlete_medals(p_user uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with mine as (
    select r.* from public.runs r where r.user_id = p_user and r.status = 'valid'
  )
  select to_jsonb(array_remove(array[
    case when exists (
      select 1 from mine group by public.week_start(mine.started_at) having sum(mine.distance_m) >= 40000
    ) then 'constancia' end,
    case when exists (
      select 1 from mine group by public.week_start(mine.started_at) having count(*) >= 5
    ) then 'ritmo' end,
    case when exists (
      select 1 from (
        select m.duration_s * 5000.0 / m.distance_m as est,
               min(m.duration_s * 5000.0 / m.distance_m) over (
                 order by m.started_at rows between unbounded preceding and 1 preceding
               ) as prev
          from mine m where m.distance_m >= 5000
      ) x where x.prev is not null and x.est < x.prev
    ) then 'explosao' end,
    case when exists (
      select 1 from mine where extract(hour from mine.started_at at time zone 'America/Sao_Paulo') < 6
    ) then 'madrugador' end,
    case when (select coalesce(sum(mine.distance_m), 0) from mine) >= 100000 then 'cem_km' end,
    case when exists (
      select 1 from (select distinct mine.team_id from mine where mine.team_id is not null) t
       where public.team_was_top5(t.team_id)
    ) then 'top5' end
  ], null));
$$;

-- -----------------------------------------------------------------------------
-- Avisos criados pelas corridas
-- -----------------------------------------------------------------------------

-- Desafios e medalhas do autor da corrida.
create or replace function public.notify_run_author(p_run public.runs)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  wk timestamptz := public.week_start(p_run.started_at);
  week_km numeric;
  week_runs int;
  total_km numeric;
  prev_best numeric;
  est numeric;
begin
  select coalesce(sum(r.distance_m), 0), count(*) into week_km, week_runs
    from public.runs r
   where r.user_id = p_run.user_id and r.status = 'valid'
     and r.started_at >= wk and r.started_at < wk + interval '7 days';

  if week_km >= 40000 and week_km - p_run.distance_m < 40000 then
    perform public.notify(p_run.user_id, 'challenge', 'route', 'success',
      'Desafio concluído: 40 km na semana', 'Você ganhou a medalha Constância',
      'challenges', '{}'::jsonb, 'challenge:km40:' || wk::date);
  end if;
  if week_runs = 5 then
    perform public.notify(p_run.user_id, 'challenge', 'calendar-check', 'success',
      'Desafio concluído: 5 treinos na semana', 'Você ganhou a medalha Ritmo',
      'challenges', '{}'::jsonb, 'challenge:runs5:' || wk::date);
  end if;
  if extract(hour from p_run.started_at at time zone 'America/Sao_Paulo') < 6 then
    perform public.notify(p_run.user_id, 'medal', 'sunrise', 'success',
      'Medalha Madrugador', 'Corrida antes das 6h. Respeito!',
      'challenges', '{}'::jsonb, 'medal:madrugador');
  end if;

  select coalesce(sum(r.distance_m), 0) into total_km
    from public.runs r where r.user_id = p_run.user_id and r.status = 'valid';
  if total_km >= 100000 and total_km - p_run.distance_m < 100000 then
    perform public.notify(p_run.user_id, 'medal', 'mountain', 'success',
      'Medalha 100 km', 'Você completou 100 km no PACE TEAM',
      'challenges', '{}'::jsonb, 'medal:cem_km');
  end if;

  if p_run.distance_m >= 5000 then
    est := p_run.duration_s * 5000.0 / p_run.distance_m;
    select min(r.duration_s * 5000.0 / r.distance_m) into prev_best
      from public.runs r
     where r.user_id = p_run.user_id and r.status = 'valid' and r.distance_m >= 5000
       and r.id <> p_run.id and r.started_at < p_run.started_at;
    if prev_best is not null and est < prev_best then
      perform public.notify(p_run.user_id, 'challenge', 'zap', 'success',
        'Novo recorde de 5 km', 'Tempo estimado de ' || public.fmt_clock(est) || ' · medalha Explosão',
        'challenges', '{}'::jsonb, 'record5k:' || p_run.id);
    end if;
  end if;
end;
$$;

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
       and w.points >= pts_before and w.points < pts_after
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

create or replace function public.on_run_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  author text;
begin
  if new.status <> 'valid' then
    return new;
  end if;
  select coalesce(nullif(p.name, ''), 'Atleta') into author from public.profiles p where p.id = new.user_id;
  perform public.notify_run_author(new);
  if new.team_id is not null then
    perform public.notify_run_team(new, coalesce(author, 'Atleta'));
  end if;
  return new;
end;
$$;

create trigger runs_notify
  after insert on public.runs
  for each row execute function public.on_run_notify();

-- -----------------------------------------------------------------------------
-- Aviso de convite (novo ou reenviado)
-- -----------------------------------------------------------------------------
create or replace function public.on_invite_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.teams;
begin
  if new.status <> 'pending' then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.status = 'pending' and old.created_at = new.created_at then
    return new;
  end if;
  select * into t from public.teams where id = new.team_id;
  perform public.notify(new.invited_user_id, 'invite', 'user-plus', 'accent',
    t.name || ' convidou você', 'Equipe ' || t.size || ' x ' || t.size || ' · ' || t.city, 'team',
    jsonb_build_object('inviteId', new.id, 'teamName', t.name),
    'invite:' || new.id || ':' || extract(epoch from new.created_at)::bigint);
  return new;
end;
$$;

create trigger team_invites_notify
  after insert or update on public.team_invites
  for each row execute function public.on_invite_notify();

-- -----------------------------------------------------------------------------
-- RPCs do app
-- -----------------------------------------------------------------------------

-- Avisos dos últimos 7 dias. Antes, cria o "resultado semanal" da semana que
-- fechou (uma vez por atleta e semana).
create or replace function public.get_notifications()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  mine public.teams;
  last_wk timestamptz := public.week_start() - interval '7 days';
begin
  select t.* into mine
    from public.teams t join public.team_members m on m.team_id = t.id
   where m.user_id = uid;

  if mine.id is not null and mine.created_at < last_wk + interval '7 days' then
    perform public.notify(uid, 'weekly_result', 'trophy', 'neutral',
      'Resultado semanal publicado',
      'Vocês fecharam a semana '
        || extract(week from last_wk at time zone 'America/Sao_Paulo')::int
        || ' em ' || public.team_city_position(mine.id, last_wk) || 'º',
      'ranking', '{}'::jsonb, 'weekly:' || mine.id || ':' || last_wk::date);
  end if;

  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', n.id,
      'kind', n.kind,
      'icon', n.icon,
      'tone', n.tone,
      'title', n.title,
      'sub', n.sub,
      'link', n.link,
      'data', n.data,
      'createdAt', n.created_at,
      'isRead', n.read_at is not null
    ) order by n.created_at desc), '[]'::jsonb)
    from (
      select * from public.notifications x
       where x.user_id = uid and x.created_at > now() - interval '7 days'
       order by x.created_at desc
       limit 60
    ) n
  );
end;
$$;

-- Marca como lidos os avisos informados (null = todos).
create or replace function public.mark_notifications_read(p_ids uuid[] default null)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.notifications
     set read_at = now()
   where user_id = (select auth.uid())
     and read_at is null
     and (p_ids is null or id = any (p_ids));
$$;

-- Progresso dos desafios e medalhas do atleta.
create or replace function public.get_my_challenges()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  wk timestamptz := public.week_start();
  month_start timestamptz := (date_trunc('month', now() at time zone 'America/Sao_Paulo')) at time zone 'America/Sao_Paulo';
  mine public.teams;
  week_km numeric;
  week_runs int;
  best_month numeric;
  best_before numeric;
  team_km numeric;
begin
  select coalesce(sum(r.distance_m), 0), count(*) into week_km, week_runs
    from public.runs r
   where r.user_id = uid and r.status = 'valid' and r.started_at >= wk;

  select min(r.duration_s * 5000.0 / r.distance_m) into best_month
    from public.runs r
   where r.user_id = uid and r.status = 'valid' and r.distance_m >= 5000 and r.started_at >= month_start;
  select min(r.duration_s * 5000.0 / r.distance_m) into best_before
    from public.runs r
   where r.user_id = uid and r.status = 'valid' and r.distance_m >= 5000 and r.started_at < month_start;

  select t.* into mine
    from public.teams t join public.team_members m on m.team_id = t.id
   where m.user_id = uid;
  if mine.id is not null then
    select coalesce(sum(r.distance_m), 0) into team_km
      from public.runs r
     where r.team_id = mine.id and r.status = 'valid' and r.started_at >= wk;
  end if;

  return jsonb_build_object(
    'weekKm', round(week_km / 1000.0, 1),
    'weekRuns', week_runs,
    'best5k', round(best_month),
    'previousBest5k', round(best_before),
    'team', case when mine.id is null then null else jsonb_build_object(
      'name', mine.name,
      'size', mine.size,
      'weekKm', round(team_km / 1000.0, 1),
      'goalKm', mine.size * 50,
      'streak', public.team_week_streak(mine.id)
    ) end,
    'medals', public.athlete_medals(uid)
  );
end;
$$;

-- Conquistas de uma equipe (tela Detalhes da equipe).
create or replace function public.get_team_achievements(p_team_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  total numeric;
  has_record boolean;
begin
  perform public.require_uid();
  select coalesce(sum(r.distance_m), 0) into total
    from public.runs r where r.team_id = p_team_id and r.status = 'valid';

  -- Recorde: alguma semana com mais km que todas as anteriores (com histórico)
  select exists (
    select 1 from (
      select w.km, max(w.km) over (order by w.wk rows between unbounded preceding and 1 preceding) as prev
        from (
          select public.week_start(r.started_at) as wk, sum(r.distance_m) as km
            from public.runs r
           where r.team_id = p_team_id and r.status = 'valid'
           group by 1
        ) w
    ) x where x.prev is not null and x.km > x.prev
  ) into has_record;

  return jsonb_build_object(
    'top5', public.team_was_top5(p_team_id),
    'maxStreak', public.team_max_streak(p_team_id),
    'totalKm', round(total / 1000.0, 1),
    'record', has_record
  );
end;
$$;

-- -----------------------------------------------------------------------------
-- Permissões
-- -----------------------------------------------------------------------------
revoke execute on function public.fmt_km(numeric)                                  from public, anon, authenticated;
revoke execute on function public.fmt_clock(numeric)                               from public, anon, authenticated;
revoke execute on function public.notify(uuid, text, text, text, text, text, text, jsonb, text) from public, anon, authenticated;
revoke execute on function public.notify_team(uuid, uuid, text, text, text, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.team_city_position(uuid, timestamptz)            from public, anon, authenticated;
revoke execute on function public.team_week_streak(uuid)                           from public, anon, authenticated;
revoke execute on function public.team_max_streak(uuid)                            from public, anon, authenticated;
revoke execute on function public.team_was_top5(uuid)                              from public, anon, authenticated;
revoke execute on function public.athlete_medals(uuid)                             from public, anon, authenticated;
revoke execute on function public.notify_run_author(public.runs)                   from public, anon, authenticated;
revoke execute on function public.notify_run_team(public.runs, text)               from public, anon, authenticated;
revoke execute on function public.on_run_notify()                                  from public, anon, authenticated;
revoke execute on function public.on_invite_notify()                               from public, anon, authenticated;

revoke execute on function public.get_notifications()              from public, anon;
revoke execute on function public.mark_notifications_read(uuid[])  from public, anon;
revoke execute on function public.get_my_challenges()              from public, anon;
revoke execute on function public.get_team_achievements(uuid)      from public, anon;

grant execute on function public.get_notifications()             to authenticated;
grant execute on function public.mark_notifications_read(uuid[]) to authenticated;
grant execute on function public.get_my_challenges()             to authenticated;
grant execute on function public.get_team_achievements(uuid)     to authenticated;
