-- =============================================================================
-- base-supabase · Migration inicial
-- -----------------------------------------------------------------------------
-- Schema, Row Level Security, triggers e funcoes RPC do backend.
-- Substitui o antigo base-server (Fastify + Prisma).
--
-- O que mudou em relacao ao schema antigo:
--   - email / senha / identidades OAuth saem das tabelas e passam a viver em
--     `auth.users` (gerenciado pelo Supabase Auth).
--   - `login_version` foi removido — o Supabase invalida sessoes nativamente.
--   - `users` virou `profiles` (1:1 com `auth.users`).
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- =============================================================================
-- Helpers
-- =============================================================================

-- Mantem a coluna updated_at sincronizada em qualquer UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Gera um codigo de indicacao de 10 caracteres (A-Z + 0-9).
create or replace function public.generate_referral_code()
returns text
language plpgsql
as $$
declare
  alphabet constant text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i int;
begin
  for i in 1..10 loop
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return result;
end;
$$;

-- Normaliza um codigo de indicacao: maiusculas, apenas [A-Z0-9].
-- Espelha base-app/src/lib/referral/normalizeReferralCode.
create or replace function public.normalize_referral_code(p_code text)
returns text
language sql
immutable
as $$
  select upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
$$;

-- =============================================================================
-- Tabelas
-- =============================================================================

-- profiles — dados do app por usuario (1:1 com auth.users).
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  name             text not null default '',
  birthday         text,
  referral_code    text not null unique,
  referred_by_code text,
  referred_by_id   uuid references public.profiles (id) on delete set null,
  is_premium       boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index profiles_referral_code_idx on public.profiles (referral_code);
create index profiles_referred_by_id_idx on public.profiles (referred_by_id);
create index profiles_is_premium_idx on public.profiles (is_premium);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- onboardings — respostas do fluxo de onboarding (um registro por usuario).
create table public.onboardings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references auth.users (id) on delete cascade,
  name         text,
  email        text,
  birthday     text,
  completed    boolean not null default false,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index onboardings_user_id_idx on public.onboardings (user_id);

create trigger onboardings_set_updated_at
  before update on public.onboardings
  for each row execute function public.set_updated_at();

-- subscriptions — estado de assinatura, alimentado pelo webhook do Paywallo.
create table public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references auth.users (id) on delete set null,
  anonymous_user_id       text,
  product_id              text not null,
  status                  text not null,
  store                   text not null,
  environment             text not null,
  is_trial                boolean not null default false,
  started_at              timestamptz not null,
  expires_at              timestamptz,
  cancelled_at            timestamptz,
  original_transaction_id text not null unique,
  last_event_id           text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_status_idx on public.subscriptions (status);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- webhook_events — idempotencia dos eventos recebidos do Paywallo.
create table public.webhook_events (
  id           uuid primary key default gen_random_uuid(),
  event_id     text not null unique,
  event_type   text not null,
  payload      jsonb not null,
  processed_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index webhook_events_event_type_idx on public.webhook_events (event_type);

-- =============================================================================
-- Criacao automatica do profile no signup
-- -----------------------------------------------------------------------------
-- Dispara para QUALQUER usuario criado em auth.users, inclusive os anonimos
-- (signInAnonymously). Quando um usuario anonimo vira permanente no cadastro,
-- nenhuma linha nova e criada em auth.users — entao o profile e reaproveitado.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_code text;
begin
  loop
    new_code := public.generate_referral_code();
    exit when not exists (select 1 from public.profiles where referral_code = new_code);
  end loop;

  insert into public.profiles (id, name, birthday, referral_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'birthday',
    new_code
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- -----------------------------------------------------------------------------
-- Usuarios anonimos (signInAnonymously) tambem recebem a role `authenticated`
-- com um auth.uid() real — por isso todas as policies miram `authenticated`.
-- =============================================================================

alter table public.profiles       enable row level security;
alter table public.onboardings    enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.webhook_events enable row level security;

-- Privilegios base (a RLS ainda restringe linha a linha).
grant select                          on public.profiles      to authenticated;
grant update (name, birthday)         on public.profiles      to authenticated;
grant select, insert, update, delete  on public.onboardings   to authenticated;
grant select                          on public.subscriptions to authenticated;

-- profiles: cada usuario enxerga e edita apenas o proprio perfil.
-- O grant de UPDATE acima limita a edicao direta a `name` e `birthday`.
-- Campos de indicacao e `is_premium` so mudam via funcoes/webhook.
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- onboardings: cada usuario enxerga e edita apenas o proprio onboarding.
create policy "onboardings_all_own"
  on public.onboardings for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- subscriptions: cada usuario enxerga apenas as proprias assinaturas.
-- A escrita e exclusiva do service_role (Edge Function do webhook).
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- webhook_events: sem policies — acessivel apenas pelo service_role.

-- =============================================================================
-- Funcoes RPC (chamadas via supabase.rpc(...) no app)
-- =============================================================================

-- Aplica um codigo de indicacao ao usuario autenticado.
create or replace function public.apply_referral_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_code     text := public.normalize_referral_code(p_code);
  v_self     public.profiles;
  v_referrer public.profiles;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into v_self from public.profiles where id = v_uid;
  if not found then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  if v_self.referred_by_code is not null then
    raise exception 'referral_already_used' using errcode = 'P0001';
  end if;

  if v_code = v_self.referral_code then
    raise exception 'self_referral' using errcode = 'P0001';
  end if;

  select * into v_referrer from public.profiles where referral_code = v_code;
  if not found then
    raise exception 'referral_code_not_found' using errcode = 'P0002';
  end if;

  update public.profiles
     set referred_by_code = v_code,
         referred_by_id   = v_referrer.id
   where id = v_uid;

  return jsonb_build_object(
    'usedCode', v_code,
    'referrer', jsonb_build_object('name', v_referrer.name)
  );
end;
$$;

-- Estatisticas de indicacao do usuario autenticado.
create or replace function public.get_referral_stats()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid   uuid := (select auth.uid());
  v_self  public.profiles;
  v_count int;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into v_self from public.profiles where id = v_uid;
  if not found then
    return jsonb_build_object('myCode', '', 'usedCode', null, 'referralsCount', 0);
  end if;

  select count(*) into v_count
    from public.profiles
   where referred_by_id = v_uid;

  return jsonb_build_object(
    'myCode', v_self.referral_code,
    'usedCode', v_self.referred_by_code,
    'referralsCount', v_count
  );
end;
$$;

-- Exclusao da propria conta: apaga auth.users -> cascata em profiles/onboardings.
create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  delete from auth.users where id = v_uid;
end;
$$;

grant execute on function public.apply_referral_code(text) to authenticated;
grant execute on function public.get_referral_stats()      to authenticated;
grant execute on function public.delete_account()          to authenticated;
