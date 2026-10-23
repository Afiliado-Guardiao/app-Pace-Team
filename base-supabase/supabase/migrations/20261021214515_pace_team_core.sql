-- =============================================================================
-- PACE TEAM · equipes, corridas, ranking e feed
-- -----------------------------------------------------------------------------
-- Tabelas: teams, team_members, team_invites, runs, posts, post_likes.
-- Escrita sensivel (criar equipe, entrar, convidar, sair) passa por funcoes
-- security definer; leitura com nomes de outros atletas tambem, para nao
-- expor colunas privadas de profiles (aniversario, indicacao, assinatura).
-- Semana do ranking: segunda 00:00 a domingo 23:59 (America/Sao_Paulo).
-- Pontos: 8 por km validado, ate 20 km por corrida.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles: dados publicos do atleta
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column handle text unique,
  add column city   text,
  add column state  text;

grant update (city, state) on public.profiles to authenticated;

-- O cadastro guarda cidade/estado nos metadados; o profile passa a copiar.
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

  insert into public.profiles (id, name, birthday, referral_code, city, state)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'birthday',
    new_code,
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'state'
  );

  return new;
end;
$$;

-- Usuario anonimo que vira permanente: os metadados chegam por update.
create or replace function public.handle_user_metadata_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
     set city  = coalesce(new.raw_user_meta_data ->> 'city', city),
         state = coalesce(new.raw_user_meta_data ->> 'state', state)
   where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_metadata_updated
  after update of raw_user_meta_data on auth.users
  for each row execute function public.handle_user_metadata_update();

-- -----------------------------------------------------------------------------
-- Helpers de calendario e pontuacao
-- -----------------------------------------------------------------------------

-- Inicio da semana do ranking (segunda 00:00 em Sao Paulo) para um instante.
create or replace function public.week_start(p_at timestamptz default now())
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select (date_trunc('week', p_at at time zone 'America/Sao_Paulo')) at time zone 'America/Sao_Paulo';
$$;

-- 8 pontos por km, ate 20 km por corrida.
create or replace function public.run_points(p_distance_m numeric)
returns int
language sql
immutable
set search_path = ''
as $$
  select floor(least(greatest(p_distance_m, 0) / 1000.0, 20) * 8)::int;
$$;

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

create table public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 40),
  city        text not null,
  region      text,
  state       text,
  size        smallint not null check (size in (3, 5, 10)),
  description text,
  logo_url    text,
  captain_id  uuid references public.profiles (id) on delete set null,
  invite_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index teams_city_idx on public.teams (city);
create index teams_size_idx on public.teams (size);

create trigger teams_set_updated_at
  before update on public.teams
  for each row execute function public.set_updated_at();

-- Um atleta participa de uma equipe por vez.
create table public.team_members (
  team_id   uuid not null references public.teams (id) on delete cascade,
  user_id   uuid not null unique references public.profiles (id) on delete cascade,
  role      text not null default 'athlete' check (role in ('captain', 'athlete')),
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create table public.team_invites (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references public.teams (id) on delete cascade,
  invited_user_id uuid not null references public.profiles (id) on delete cascade,
  invited_by      uuid references public.profiles (id) on delete set null,
  status          text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at      timestamptz not null default now(),
  responded_at    timestamptz,
  unique (team_id, invited_user_id)
);

create index team_invites_invited_user_idx on public.team_invites (invited_user_id, status);

-- Corridas. status/points/team_id sao definidos pelo trigger de validacao.
create table public.runs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  team_id     uuid references public.teams (id) on delete set null,
  mode        text not null default 'free' check (mode in ('free', 'dist', 'time', 'team')),
  started_at  timestamptz not null,
  finished_at timestamptz not null,
  duration_s  int not null check (duration_s >= 0),
  distance_m  numeric(10, 1) not null check (distance_m >= 0),
  -- Percurso simplificado: [[lat, lng], ...]
  route       jsonb not null default '[]'::jsonb,
  status      text not null default 'pending' check (status in ('pending', 'valid', 'invalid')),
  points      int not null default 0,
  created_at  timestamptz not null default now()
);

create index runs_user_started_idx on public.runs (user_id, started_at desc);
create index runs_team_started_idx on public.runs (team_id, started_at desc);

create table public.posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  team_id    uuid references public.teams (id) on delete set null,
  run_id     uuid references public.runs (id) on delete set null,
  -- Foto enviada (bucket post-photos) ou indice de uma foto de exemplo do app
  image_path text,
  sample     smallint,
  seconds    int not null default 0,
  km         numeric(6, 2) not null default 0,
  layers     jsonb not null default '{"route": true, "stats": true, "badge": true}'::jsonb,
  caption    text not null default '' check (char_length(caption) <= 500),
  created_at timestamptz not null default now()
);

create index posts_created_idx on public.posts (created_at desc);
create index posts_user_idx on public.posts (user_id);

create table public.post_likes (
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index post_likes_user_idx on public.post_likes (user_id);

-- -----------------------------------------------------------------------------
-- Validacao da corrida (antes de inserir)
-- -----------------------------------------------------------------------------
-- Regras do MVP: minimo de 1 min e 100 m, velocidade media de ate 25 km/h
-- (7 m/s). O app ja descarta saltos de GPS ponto a ponto.
create or replace function public.validate_run()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  avg_speed numeric;
begin
  new.user_id := (select auth.uid());
  select tm.team_id into new.team_id
    from public.team_members tm
   where tm.user_id = new.user_id;

  avg_speed := case when new.duration_s > 0 then new.distance_m / new.duration_s else 0 end;

  if new.duration_s < 60 or new.distance_m < 100 or avg_speed > 7 then
    new.status := 'invalid';
    new.points := 0;
  else
    new.status := 'valid';
    new.points := public.run_points(new.distance_m);
  end if;

  return new;
end;
$$;

create trigger runs_validate
  before insert on public.runs
  for each row execute function public.validate_run();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.teams        enable row level security;
alter table public.team_members enable row level security;
alter table public.team_invites enable row level security;
alter table public.runs         enable row level security;
alter table public.posts        enable row level security;
alter table public.post_likes   enable row level security;

grant select                              on public.teams        to authenticated;
grant update (name, city, region, state, description, logo_url) on public.teams to authenticated;
grant select                              on public.team_members to authenticated;
grant select                              on public.team_invites to authenticated;
grant select, delete                      on public.runs         to authenticated;
grant insert (mode, started_at, finished_at, duration_s, distance_m, route) on public.runs to authenticated;
grant select, delete                      on public.posts        to authenticated;
grant insert (team_id, run_id, image_path, sample, seconds, km, layers, caption) on public.posts to authenticated;
grant select, insert, delete              on public.post_likes   to authenticated;

-- Equipes e integrantes sao publicos para quem esta logado (ranking, detalhes).
create policy "teams_select_all" on public.teams
  for select to authenticated using (true);

create policy "teams_update_captain" on public.teams
  for update to authenticated
  using ((select auth.uid()) = captain_id)
  with check ((select auth.uid()) = captain_id);

create policy "team_members_select_all" on public.team_members
  for select to authenticated using (true);

-- Convites: quem recebeu ou quem esta na equipe que convidou.
create policy "team_invites_select_involved" on public.team_invites
  for select to authenticated
  using (
    (select auth.uid()) = invited_user_id
    or exists (
      select 1 from public.team_members tm
       where tm.team_id = team_invites.team_id and tm.user_id = (select auth.uid())
    )
  );

-- Corridas: as proprias e as dos colegas de equipe.
create policy "runs_select_own_or_team" on public.runs
  for select to authenticated
  using (
    (select auth.uid()) = user_id
    or exists (
      select 1 from public.team_members tm
       where tm.team_id = runs.team_id and tm.user_id = (select auth.uid())
    )
  );

create policy "runs_insert_own" on public.runs
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "runs_delete_own" on public.runs
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Feed: posts visiveis para todos os atletas logados.
create policy "posts_select_all" on public.posts
  for select to authenticated using (true);

create policy "posts_insert_own" on public.posts
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "posts_delete_own" on public.posts
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "post_likes_select_all" on public.post_likes
  for select to authenticated using (true);

create policy "post_likes_insert_own" on public.post_likes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "post_likes_delete_own" on public.post_likes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- user_id do post vem da sessao, nunca do cliente.
alter table public.posts alter column user_id set default auth.uid();

-- -----------------------------------------------------------------------------
-- Storage: fotos dos posts (leitura publica, escrita na pasta do proprio uid)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-photos', 'post-photos', true, 8388608, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "post_photos_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'post-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "post_photos_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'post-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
