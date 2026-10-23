-- =============================================================================
-- PACE TEAM · Pace Buddy fora do app (widget, Toque Traseiro, avisos)
-- -----------------------------------------------------------------------------
-- Tabelas: buddy_profiles, device_tokens, team_presence_pings,
-- buddy_notify_throttle.
-- - buddy_profiles: metas, cor e acessorios do Buddy valem em qualquer
--   aparelho (app e Swift leem a mesma linha). Metas so sobem pela RPC
--   buddy_complete_goal; o insert aceita goals uma vez para migrar o
--   contador que ja estava salvo no celular.
-- - device_tokens: tokens de push (Expo) de cada aparelho.
-- - team_presence_pings + buddy_notify_throttle: "colega online". O aviso vai
--   no maximo 1 vez a cada 2 h por par (quem ficou online -> colega).
-- Dias do despertador: 0 = domingo ... 6 = sabado (igual Date.getDay()).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------
create table public.buddy_profiles (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  goals      int not null default 0 check (goals >= 0),
  color      text not null default 'branco'
             check (color in ('branco', 'lilas', 'azul', 'verde', 'amarelo', 'bronze', 'prata', 'ouro')),
  last_free  text not null default 'branco'
             check (last_free in ('branco', 'lilas', 'azul', 'verde', 'amarelo', 'bronze', 'prata', 'ouro')),
  equipped   text[] not null default '{}'
             check (equipped <@ array['faixa', 'grau', 'oculos', 'bone', 'boneTras', 'coroa', 'aureola', 'capa']),
  alarm_time time,
  alarm_days int[] not null default '{}' check (alarm_days <@ array[0, 1, 2, 3, 4, 5, 6]),
  updated_at timestamptz not null default now()
);

create trigger buddy_profiles_set_updated_at
  before update on public.buddy_profiles
  for each row execute function public.set_updated_at();

create table public.device_tokens (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  token      text not null check (char_length(token) between 10 and 300),
  platform   text not null default 'ios' check (platform in ('ios', 'android', 'web')),
  updated_at timestamptz not null default now(),
  primary key (user_id, token)
);

create index device_tokens_token_idx on public.device_tokens (token);

create trigger device_tokens_set_updated_at
  before update on public.device_tokens
  for each row execute function public.set_updated_at();

create table public.team_presence_pings (
  id      bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  at      timestamptz not null default now()
);

create index team_presence_pings_team_at_idx on public.team_presence_pings (team_id, at desc);
create index team_presence_pings_user_at_idx on public.team_presence_pings (user_id, at desc);

-- Ultimo aviso "online" enviado de from_user para to_user.
create table public.buddy_notify_throttle (
  from_user    uuid not null references auth.users (id) on delete cascade,
  to_user      uuid not null references auth.users (id) on delete cascade,
  last_sent_at timestamptz not null default now(),
  primary key (from_user, to_user)
);

create index buddy_notify_throttle_to_user_idx on public.buddy_notify_throttle (to_user);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.buddy_profiles        enable row level security;
alter table public.device_tokens         enable row level security;
alter table public.team_presence_pings   enable row level security;
alter table public.buddy_notify_throttle enable row level security;

grant select on public.buddy_profiles to authenticated;
grant insert (goals, color, last_free, equipped, alarm_time, alarm_days) on public.buddy_profiles to authenticated;
grant update (color, last_free, equipped, alarm_time, alarm_days)        on public.buddy_profiles to authenticated;

grant select, delete on public.device_tokens to authenticated;
grant insert (token, platform) on public.device_tokens to authenticated;
grant update (platform)        on public.device_tokens to authenticated;

grant select on public.team_presence_pings to authenticated;

-- buddy_notify_throttle: so backend (RLS sem policy).

create policy "buddy_profiles_select_own" on public.buddy_profiles
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "buddy_profiles_insert_own" on public.buddy_profiles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "buddy_profiles_update_own" on public.buddy_profiles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "device_tokens_select_own" on public.device_tokens
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "device_tokens_insert_own" on public.device_tokens
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "device_tokens_update_own" on public.device_tokens
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "device_tokens_delete_own" on public.device_tokens
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Pings: os proprios e os dos colegas de equipe (pontinho verde).
create policy "team_presence_pings_select_own_or_team" on public.team_presence_pings
  for select to authenticated
  using (
    (select auth.uid()) = user_id
    or exists (
      select 1 from public.team_members tm
       where tm.team_id = team_presence_pings.team_id and tm.user_id = (select auth.uid())
    )
  );

-- -----------------------------------------------------------------------------
-- RPCs
-- -----------------------------------------------------------------------------

-- Registra o token de push deste aparelho. Se o token estava em outra conta
-- (logout/login no mesmo celular), sai de la para o aviso nao ir errado.
create or replace function public.buddy_register_device(p_token text, p_platform text default 'ios')
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
begin
  delete from public.device_tokens where token = p_token and user_id <> uid;
  insert into public.device_tokens (user_id, token, platform)
  values (uid, p_token, coalesce(p_platform, 'ios'))
  on conflict (user_id, token)
  do update set platform = excluded.platform, updated_at = now();
end;
$$;

-- Soma 1 meta cumprida e diz qual acessorio liberou exatamente nessa conta.
create or replace function public.buddy_complete_goal()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  new_goals int;
begin
  insert into public.buddy_profiles (user_id, goals)
  values (uid, 1)
  on conflict (user_id)
  do update set goals = public.buddy_profiles.goals + 1
  returning goals into new_goals;

  return jsonb_build_object(
    'goals', new_goals,
    'unlocked', case new_goals
      when 3  then 'faixa'
      when 5  then 'grau'
      when 8  then 'oculos'
      when 15 then 'bone'
      when 22 then 'boneTras'
      when 30 then 'aureola'
      when 50 then 'capa'
    end
  );
end;
$$;

-- Marca o atleta como online na equipe e devolve os colegas (com token) que
-- ainda nao foram avisados sobre ele nas ultimas 2 h, ja atualizando o limite.
create or replace function public.buddy_ping_online()
returns jsonb
language plpgsql
security definer
set search_path = ''
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

  -- Upsert condicional: so devolve quem nao recebeu aviso ha 2 h.
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

-- -----------------------------------------------------------------------------
-- Permissoes
-- -----------------------------------------------------------------------------
revoke execute on function public.buddy_register_device(text, text) from public, anon;
revoke execute on function public.buddy_complete_goal()             from public, anon;
revoke execute on function public.buddy_ping_online()               from public, anon;

grant execute on function public.buddy_register_device(text, text) to authenticated;
grant execute on function public.buddy_complete_goal()             to authenticated;
grant execute on function public.buddy_ping_online()               to authenticated;
