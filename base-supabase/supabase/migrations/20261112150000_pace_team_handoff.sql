-- =============================================================================
-- Equipe do onboarding não se perde no login da Apple + equipes fantasma
-- -----------------------------------------------------------------------------
-- 1. leave_team_as(uid): a regra de sair da equipe num lugar só. Se o capitão
--    sai, o integrante mais antigo vira capitão; se ninguém sobra, a equipe
--    é apagada. leave_team() passa a usar essa função.
-- 2. create_team(..., p_leave): quem já está numa equipe pode sair dela e abrir
--    a nova no mesmo passo (o app pergunta antes).
-- 3. Passagem da equipe do onboarding: a conta provisória (anônima) cria um
--    token antes de o login da Apple trocar para a conta antiga do atleta. A
--    conta antiga usa o token para levar a equipe ("move") ou ficar na equipe
--    que já tinha ("stay"). Sem equipe na conta antiga, vai direto ("auto").
-- 4. Ranking: equipe cujo capitão ainda é conta provisória (onboarding
--    abandonado) não aparece para as outras equipes.
-- =============================================================================

-- 1. Sair da equipe ------------------------------------------------------------

create or replace function public.leave_team_as(p_uid uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  my_team uuid;
  my_role text;
  heir uuid;
begin
  select tm.team_id, tm.role into my_team, my_role
    from public.team_members tm where tm.user_id = p_uid;
  if my_team is null then
    return;
  end if;

  delete from public.team_members where user_id = p_uid;

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

-- Só as funções do banco chamam (nunca o app direto)
revoke execute on function public.leave_team_as(uuid) from public, anon, authenticated;

create or replace function public.leave_team()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.leave_team_as(public.require_uid());
end;
$$;

-- 2. Criar equipe saindo da atual ---------------------------------------------

drop function if exists public.create_team(text, text, text, integer, text);

create function public.create_team(
  p_name text,
  p_city text,
  p_region text,
  p_size integer,
  p_country text default 'BR',
  p_leave boolean default false
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
    if not p_leave then
      raise exception 'already_in_team';
    end if;
    perform public.leave_team_as(uid);
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

revoke execute on function public.create_team(text, text, text, integer, text, boolean) from public, anon;
grant execute on function public.create_team(text, text, text, integer, text, boolean) to authenticated;

-- 3. Passagem da equipe do onboarding ------------------------------------------

create table public.team_handoffs (
  token text primary key,
  from_user uuid not null references auth.users (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

-- Só pelas funções abaixo (sem policy: o app não lê nem escreve direto)
alter table public.team_handoffs enable row level security;

create index team_handoffs_from_user_idx on public.team_handoffs (from_user);
create index team_handoffs_team_id_idx on public.team_handoffs (team_id);

-- Conta provisória com equipe: gera o token (null se não houver o que levar)
create or replace function public.start_team_handoff()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  tok text;
begin
  if not exists (select 1 from auth.users u where u.id = uid and u.is_anonymous) then
    return null;
  end if;
  select tm.team_id into my_team from public.team_members tm where tm.user_id = uid;
  if my_team is null then
    return null;
  end if;

  delete from public.team_handoffs where from_user = uid;
  tok := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  insert into public.team_handoffs (token, from_user, team_id) values (tok, uid, my_team);
  return tok;
end;
$$;

revoke execute on function public.start_team_handoff() from public, anon;
grant execute on function public.start_team_handoff() to authenticated;

-- Conta do atleta usa o token: p_choice = 'auto' | 'move' | 'stay'
-- Devolve { status: moved | stayed | choose | gone, teamName, currentTeamName }
create or replace function public.claim_team_handoff(p_token text, p_choice text default 'auto')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  h public.team_handoffs;
  old_role text;
  old_joined timestamptz;
  new_name text;
  cur_team uuid;
  cur_name text;
begin
  select * into h
    from public.team_handoffs th
   where th.token = p_token
     and th.used_at is null
     and th.created_at > now() - interval '2 days'
   for update;
  if h.token is null or h.from_user = uid then
    return jsonb_build_object('status', 'gone');
  end if;

  select tm.role, tm.joined_at into old_role, old_joined
    from public.team_members tm
   where tm.user_id = h.from_user and tm.team_id = h.team_id;
  if old_role is null then
    update public.team_handoffs set used_at = now() where token = p_token;
    return jsonb_build_object('status', 'gone');
  end if;

  select t.name into new_name from public.teams t where t.id = h.team_id;
  select tm.team_id, t.name into cur_team, cur_name
    from public.team_members tm
    join public.teams t on t.id = tm.team_id
   where tm.user_id = uid;

  -- Já está na mesma equipe: só tira a conta provisória
  if cur_team = h.team_id then
    perform public.leave_team_as(h.from_user);
    update public.team_handoffs set used_at = now() where token = p_token;
    return jsonb_build_object('status', 'moved', 'teamName', new_name);
  end if;

  if cur_team is not null and p_choice = 'auto' then
    return jsonb_build_object('status', 'choose', 'teamName', new_name, 'currentTeamName', cur_name);
  end if;

  if cur_team is not null and p_choice = 'stay' then
    perform public.leave_team_as(h.from_user);
    update public.team_handoffs set used_at = now() where token = p_token;
    return jsonb_build_object('status', 'stayed', 'teamName', cur_name);
  end if;

  -- Leva a equipe: sai da atual (mesma regra de sempre) e assume o lugar da
  -- conta provisória (mesmo papel e mesma data de entrada)
  if cur_team is not null then
    perform public.leave_team_as(uid);
  end if;
  delete from public.team_members where user_id = h.from_user and team_id = h.team_id;
  insert into public.team_members (team_id, user_id, role, joined_at)
  values (h.team_id, uid, old_role, old_joined);
  if old_role = 'captain' then
    update public.teams set captain_id = uid where id = h.team_id;
  end if;
  update public.team_invites
     set status = 'accepted', responded_at = now()
   where team_id = h.team_id and invited_user_id = uid and status = 'pending';
  update public.team_handoffs set used_at = now() where token = p_token;
  return jsonb_build_object('status', 'moved', 'teamName', new_name);
end;
$$;

revoke execute on function public.claim_team_handoff(text, text) from public, anon;
grant execute on function public.claim_team_handoff(text, text) to authenticated;

-- 4. Ranking sem equipes fantasma ---------------------------------------------

-- Equipe com capitão em conta provisória só conta para quem está nela
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
   where not exists (
           select 1 from auth.users u
            where u.id = t.captain_id and u.is_anonymous
         )
      or exists (
           select 1 from public.team_members m
            where m.team_id = t.id and m.user_id = (select auth.uid())
         )
   group by t.id;
$$;
