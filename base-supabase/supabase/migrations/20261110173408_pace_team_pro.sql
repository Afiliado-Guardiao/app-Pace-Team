-- =============================================================================
-- PACE TEAM PRO — assinatura da equipe (2026-11-09)
-- -----------------------------------------------------------------------------
-- O app é grátis. O capitão assina o Team Pro (Apple, via RevenueCat) e a
-- assinatura fica ligada à equipe dele: até 10 integrantes (capitão incluso,
-- pela ordem de entrada) recebem os recursos Pro. Quem passa de 10 fica no Free.
--
-- - subscriptions.team_id: equipe que a compra libera (o webhook preenche)
-- - subscriptions.team_until: se quem paga sai da equipe, ela mantém o Pro só
--   até o fim do período que já estava pago
-- - get_my_pro(): status do Pro para o atleta logado (a fonte da verdade do app)
-- - link_my_pro_to_team(): quem paga leva a assinatura para a equipe que
--   capitaneia agora (a antiga perde na hora — nunca duas equipes ao mesmo tempo)
-- - transfer_captain(): o capitão passa a liderança para outro integrante
-- =============================================================================

alter table public.subscriptions
  add column if not exists team_id    uuid references public.teams (id) on delete set null,
  add column if not exists team_until timestamptz;

create index if not exists subscriptions_team_id_idx on public.subscriptions (team_id);

-- Assinatura que vale agora para a equipe (ou nada)
create or replace function public.team_pro_subscription(p_team uuid)
returns public.subscriptions
language sql
stable
security definer
set search_path = ''
as $$
  select s.*
    from public.subscriptions s
   where s.team_id = p_team
     and s.status not in ('expired', 'paused')
     and (s.expires_at is null or s.expires_at > now())
     and (s.team_until is null or s.team_until > now())
   order by s.expires_at desc nulls last
   limit 1;
$$;

-- Integrantes cobertos: capitão primeiro, depois pela ordem de entrada (máx. 10)
create or replace function public.team_pro_covered(p_team uuid)
returns table (user_id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select tm.user_id
    from public.team_members tm
   where tm.team_id = p_team
   order by (tm.role = 'captain') desc, tm.joined_at, tm.user_id
   limit 10;
$$;

-- Assinatura ativa paga pelo atleta (em qualquer equipe)
create or replace function public.my_paid_subscription(p_uid uuid)
returns public.subscriptions
language sql
stable
security definer
set search_path = ''
as $$
  select s.*
    from public.subscriptions s
   where s.user_id = p_uid
     and s.status not in ('expired', 'paused')
     and (s.expires_at is null or s.expires_at > now())
   order by s.expires_at desc nulls last
   limit 1;
$$;

create or replace function public.get_my_pro()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  my_role text;
  team_name text;
  members int := 0;
  sub public.subscriptions;
  own public.subscriptions;
  is_covered boolean := false;
  payer text;
  own_team_name text;
begin
  select tm.team_id, tm.role into my_team, my_role
    from public.team_members tm where tm.user_id = uid;

  if my_team is not null then
    select t.name into team_name from public.teams t where t.id = my_team;
    select count(*) into members from public.team_members tm where tm.team_id = my_team;
    sub := public.team_pro_subscription(my_team);
    if sub.id is not null then
      is_covered := exists (select 1 from public.team_pro_covered(my_team) c where c.user_id = uid);
      select p.name into payer from public.profiles p where p.id = sub.user_id;
    end if;
  end if;

  own := public.my_paid_subscription(uid);
  if own.team_id is not null then
    select t.name into own_team_name from public.teams t where t.id = own.team_id;
  end if;

  return jsonb_build_object(
    'isPro', is_covered,
    'teamPro', sub.id is not null,
    'teamId', my_team,
    'teamName', team_name,
    'isCaptain', coalesce(my_role = 'captain', false),
    'isPayer', sub.id is not null and sub.user_id = uid,
    'payerName', payer,
    'members', members,
    'covered', least(members, 10),
    'limit', 10,
    'productId', sub.product_id,
    'status', sub.status,
    'expiresAt', sub.expires_at,
    'endsAt', coalesce(sub.team_until, case when sub.status = 'cancelled' then sub.expires_at end),
    'hasOwnSub', own.id is not null,
    'ownSubTeamId', own.team_id,
    'ownSubTeamName', own_team_name
  );
end;
$$;

-- Quem paga leva a assinatura para a equipe que capitaneia agora
create or replace function public.link_my_pro_to_team()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  own public.subscriptions;
begin
  select tm.team_id into my_team
    from public.team_members tm where tm.user_id = uid and tm.role = 'captain';
  if my_team is null then
    raise exception 'not_captain' using errcode = 'P0001';
  end if;
  own := public.my_paid_subscription(uid);
  if own.id is null then
    raise exception 'no_subscription' using errcode = 'P0001';
  end if;
  update public.subscriptions
     set team_id = my_team, team_until = null
   where id = own.id;
end;
$$;

-- Capitão passa a liderança (e a gestão da equipe) para outro integrante
create or replace function public.transfer_captain(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
begin
  select tm.team_id into my_team
    from public.team_members tm where tm.user_id = uid and tm.role = 'captain';
  if my_team is null then
    raise exception 'not_captain' using errcode = 'P0001';
  end if;
  if p_user_id = uid or not exists (
    select 1 from public.team_members tm where tm.team_id = my_team and tm.user_id = p_user_id
  ) then
    raise exception 'not_member' using errcode = 'P0001';
  end if;
  update public.team_members set role = 'athlete' where team_id = my_team and user_id = uid;
  update public.team_members set role = 'captain' where team_id = my_team and user_id = p_user_id;
  update public.teams set captain_id = p_user_id where id = my_team;
end;
$$;

-- Quem paga saiu da equipe: ela fica com o Pro só até o fim do período pago.
-- Voltou para a equipe: o vínculo volta a valer normalmente.
create or replace function public.team_pro_member_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    update public.subscriptions s
       set team_until = coalesce(s.team_until, s.expires_at, now())
     where s.team_id = old.team_id and s.user_id = old.user_id;
    return old;
  end if;
  update public.subscriptions s
     set team_until = null
   where s.team_id = new.team_id and s.user_id = new.user_id;
  return new;
end;
$$;

drop trigger if exists team_members_pro_link on public.team_members;
create trigger team_members_pro_link
  after insert or delete on public.team_members
  for each row execute function public.team_pro_member_change();

revoke execute on function public.team_pro_subscription(uuid) from public, anon, authenticated;
revoke execute on function public.team_pro_covered(uuid) from public, anon, authenticated;
revoke execute on function public.my_paid_subscription(uuid) from public, anon, authenticated;
revoke execute on function public.team_pro_member_change() from public, anon, authenticated;
revoke execute on function public.get_my_pro() from public, anon;
revoke execute on function public.link_my_pro_to_team() from public, anon;
revoke execute on function public.transfer_captain(uuid) from public, anon;
grant execute on function public.get_my_pro() to authenticated;
grant execute on function public.link_my_pro_to_team() to authenticated;
grant execute on function public.transfer_captain(uuid) to authenticated;
