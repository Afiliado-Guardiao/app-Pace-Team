-- =============================================================================
-- PACE AI (Team Pro) — 2026-11-11
-- -----------------------------------------------------------------------------
-- O Buddy responde sobre as corridas do atleta (Claude Haiku 5.5, chamado pela
-- Edge Function pace-ai). Aqui ficam:
-- - ai_conversations / ai_messages: histórico de conversas (o atleta lê e
--   apaga as dele; só a Edge Function grava)
-- - get_ai_context(): os números reais que a IA pode usar (corridas válidas do
--   atleta e a semana da equipe). Nada é inventado: a IA só vê isto.
-- O limite de perguntas por dia é contado nas mensagens do próprio dia.
-- =============================================================================

create table if not exists public.ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  title      text not null default '' check (char_length(title) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_conversations_user_idx
  on public.ai_conversations (user_id, updated_at desc);

create table if not exists public.ai_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null check (char_length(content) <= 6000),
  input_tokens    integer,
  output_tokens   integer,
  created_at      timestamptz not null default now()
);

create index if not exists ai_messages_conversation_idx
  on public.ai_messages (conversation_id, created_at);
create index if not exists ai_messages_user_day_idx
  on public.ai_messages (user_id, created_at) where role = 'user';

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

-- O atleta lê as conversas dele e pode apagar uma conversa inteira.
-- Gravar é só da Edge Function (service_role ignora a RLS).
drop policy if exists "ai_conversations_select_own" on public.ai_conversations;
create policy "ai_conversations_select_own"
  on public.ai_conversations for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "ai_conversations_delete_own" on public.ai_conversations;
create policy "ai_conversations_delete_own"
  on public.ai_conversations for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "ai_messages_select_own" on public.ai_messages;
create policy "ai_messages_select_own"
  on public.ai_messages for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.ai_conversations from anon, authenticated;
revoke all on public.ai_messages from anon, authenticated;
grant select, delete on public.ai_conversations to authenticated;
grant select on public.ai_messages to authenticated;

drop trigger if exists ai_conversations_updated_at on public.ai_conversations;
create trigger ai_conversations_updated_at
  before update on public.ai_conversations
  for each row execute function public.set_updated_at();

-- Pace em segundos por km (só faz sentido a partir de 500 m)
create or replace function public.ai_pace(p_seconds numeric, p_meters numeric)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when p_meters >= 500 then round(p_seconds / (p_meters / 1000.0))::int end;
$$;

-- Tudo o que a PACE AI pode saber sobre o atleta, em números reais
create or replace function public.get_ai_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  this_week timestamptz := public.week_start(now());
  today date := (now() at time zone 'America/Sao_Paulo')::date;
  day_start timestamptz := (today::timestamp at time zone 'America/Sao_Paulo');
  me public.profiles;
  mine public.teams;
  my_points bigint;
  my_km numeric;
  rival record;
  team_json jsonb;
begin
  select p.* into me from public.profiles p where p.id = uid;
  select t.* into mine
    from public.teams t
    join public.team_members m on m.team_id = t.id
   where m.user_id = uid;

  if mine.id is not null then
    select w.points, w.km into my_points, my_km
      from public.team_week_totals(this_week) w where w.team_id = mine.id;

    with ranked as (
      select t.id, t.name, w.points, w.km,
             (rank() over (order by w.points desc, w.km desc, t.created_at))::int as pos
        from public.teams t
        join public.team_week_totals(this_week) w on w.team_id = t.id
       where t.size = mine.size and t.city = mine.city
    ),
    me_rank as (select r.pos from ranked r where r.id = mine.id)
    select r.* into rival
      from ranked r, me_rank
     where r.id <> mine.id
     order by (r.pos < me_rank.pos) desc, abs(r.pos - me_rank.pos), r.pos
     limit 1;

    team_json := jsonb_build_object(
      'name', mine.name,
      'city', mine.city,
      'size', mine.size,
      'weekKm', round(coalesce(my_km, 0), 1),
      'weekPoints', coalesce(my_points, 0),
      'prevWeekKm', (
        select round(coalesce(w.km, 0), 1)
          from public.team_week_totals(this_week - interval '7 days') w
         where w.team_id = mine.id
      ),
      'cityRank', public.team_week_rank(mine.id, this_week),
      'rival', case when rival.id is null then null else jsonb_build_object(
        'name', rival.name,
        'position', rival.pos,
        'km', round(rival.km, 1),
        'gapKm', round(rival.km - coalesce(my_km, 0), 1),
        'gapPoints', rival.points - coalesce(my_points, 0)
      ) end,
      'mates', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'name', p.name,
          'isYou', p.id = uid,
          'role', m.role,
          'weekKm', round(coalesce(s.week_km, 0), 1),
          'weekRuns', coalesce(s.week_runs, 0),
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
      )
    );
  end if;

  return jsonb_build_object(
    'today', today,
    'weekStart', (this_week at time zone 'America/Sao_Paulo')::date,
    'questionsToday', (
      select count(*) from public.ai_messages a
       where a.user_id = uid and a.role = 'user' and a.created_at >= day_start
    ),
    'me', jsonb_build_object(
      'name', me.name,
      'city', me.city,
      'totalKm', (
        select round(coalesce(sum(r.distance_m), 0) / 1000.0, 1)
          from public.runs r where r.user_id = uid and r.status = 'valid'
      ),
      'totalRuns', (select count(*) from public.runs r where r.user_id = uid and r.status = 'valid'),
      'firstRun', (
        select min((r.started_at at time zone 'America/Sao_Paulo')::date)
          from public.runs r where r.user_id = uid and r.status = 'valid'
      )
    ),
    -- 12 semanas (segunda a domingo), da mais antiga para a atual
    'weeks', (
      select jsonb_agg(jsonb_build_object(
        'start', (g.ws at time zone 'America/Sao_Paulo')::date,
        'km', round(coalesce(s.meters, 0) / 1000.0, 1),
        'runs', coalesce(s.runs, 0),
        'minutes', round(coalesce(s.seconds, 0) / 60.0),
        'paceSecKm', public.ai_pace(s.seconds, s.meters)
      ) order by g.ws)
      from (select this_week - n * interval '7 days' as ws from generate_series(0, 11) as n) g
      left join lateral (
        select sum(r.distance_m) as meters, sum(r.duration_s) as seconds, count(*) as runs
          from public.runs r
         where r.user_id = uid and r.status = 'valid'
           and r.started_at >= g.ws and r.started_at < g.ws + interval '7 days'
      ) s on true
    ),
    -- Mês atual e os dois anteriores
    'months', (
      select jsonb_agg(jsonb_build_object(
        'month', to_char(g.ms, 'YYYY-MM'),
        'km', round(coalesce(s.meters, 0) / 1000.0, 1),
        'runs', coalesce(s.runs, 0),
        'paceSecKm', public.ai_pace(s.seconds, s.meters)
      ) order by g.ms)
      from (
        select (date_trunc('month', today) - n * interval '1 month')::date as ms
          from generate_series(0, 2) as n
      ) g
      left join lateral (
        select sum(r.distance_m) as meters, sum(r.duration_s) as seconds, count(*) as runs
          from public.runs r
         where r.user_id = uid and r.status = 'valid'
           and (r.started_at at time zone 'America/Sao_Paulo')::date >= g.ms
           and (r.started_at at time zone 'America/Sao_Paulo')::date < (g.ms + interval '1 month')::date
      ) s on true
    ),
    -- As 15 corridas mais recentes
    'recent', (
      select coalesce(jsonb_agg(x.j order by x.started_at desc), '[]'::jsonb)
        from (
          select r.started_at, jsonb_build_object(
            'date', (r.started_at at time zone 'America/Sao_Paulo')::date,
            'km', round(r.distance_m / 1000.0, 2),
            'minutes', round(r.duration_s / 60.0, 1),
            'paceSecKm', public.ai_pace(r.duration_s, r.distance_m),
            'withTeam', r.mode = 'team'
          ) as j
            from public.runs r
           where r.user_id = uid and r.status = 'valid'
           order by r.started_at desc
           limit 15
        ) x
    ),
    'bests', jsonb_build_object(
      'longest', (
        select jsonb_build_object(
          'date', (r.started_at at time zone 'America/Sao_Paulo')::date,
          'km', round(r.distance_m / 1000.0, 2),
          'paceSecKm', public.ai_pace(r.duration_s, r.distance_m)
        )
          from public.runs r where r.user_id = uid and r.status = 'valid'
         order by r.distance_m desc limit 1
      ),
      'fastestFrom1k', (
        select jsonb_build_object(
          'date', (r.started_at at time zone 'America/Sao_Paulo')::date,
          'km', round(r.distance_m / 1000.0, 2),
          'paceSecKm', public.ai_pace(r.duration_s, r.distance_m)
        )
          from public.runs r where r.user_id = uid and r.status = 'valid' and r.distance_m >= 1000
         order by r.duration_s / r.distance_m limit 1
      ),
      'fastestFrom5k', (
        select jsonb_build_object(
          'date', (r.started_at at time zone 'America/Sao_Paulo')::date,
          'km', round(r.distance_m / 1000.0, 2),
          'paceSecKm', public.ai_pace(r.duration_s, r.distance_m)
        )
          from public.runs r where r.user_id = uid and r.status = 'valid' and r.distance_m >= 4900
         order by r.duration_s / r.distance_m limit 1
      )
    ),
    'team', team_json
  );
end;
$$;

revoke execute on function public.get_ai_context() from public, anon;
grant execute on function public.get_ai_context() to authenticated;
