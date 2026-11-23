-- =============================================================================
-- PACE TEAM PRO aberto a todos (2026-11-23)
-- -----------------------------------------------------------------------------
-- Antes só o capitão de uma equipe conseguia assinar. Agora qualquer atleta
-- assina pela janela do Team Pro:
-- - quem paga tem o Pro na hora, mesmo sem equipe (ou fora das 10 vagas)
-- - a assinatura sem equipe se liga sozinha à equipe que ele criar ou entrar
--   (o app chama link_my_pro_to_team), desde que a equipe ainda não seja PRO
-- - integrante (não só capitão) também liga a assinatura à própria equipe
-- =============================================================================

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

  -- Quem paga sempre tem o Pro: sem equipe, ou com a assinatura na própria equipe
  if own.id is not null and (own.team_id is null or own.team_id = my_team) then
    is_covered := true;
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

-- Quem paga leva a assinatura para a equipe em que está agora (capitão ou
-- integrante). Se a equipe já tem o Pro de outra pessoa, não troca.
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
  current_sub public.subscriptions;
begin
  select tm.team_id into my_team
    from public.team_members tm where tm.user_id = uid;
  if my_team is null then
    raise exception 'no_team' using errcode = 'P0001';
  end if;
  own := public.my_paid_subscription(uid);
  if own.id is null then
    raise exception 'no_subscription' using errcode = 'P0001';
  end if;
  current_sub := public.team_pro_subscription(my_team);
  if current_sub.id is not null and current_sub.id <> own.id then
    raise exception 'team_has_pro' using errcode = 'P0001';
  end if;
  update public.subscriptions
     set team_id = my_team, team_until = null
   where id = own.id;
end;
$$;
