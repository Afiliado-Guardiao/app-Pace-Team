-- Roleta da equipe ("Jogar com a equipe", em Correr com a equipe).
-- Dinâmica imediata: quem chama a roleta gira por todos os que estão online
-- agora (últimos 10 min, mesma regra do get_team_online). Cada giro sorteia
-- (no servidor) um nome e uma casa da roleta (km + pace) para essa pessoa.
-- Depois de todos sorteados, cada um corre o seu desafio na hora: a corrida
-- salva confere km e pace. Todos cumpriram → cada um soma o bônus do nível.
-- Quem falhar → tira pontos. Os pontos entram no ranking da semana (pode zerar,
-- nunca fica negativo). Só uma roleta por equipe de cada vez.

create table public.team_games (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  started_by uuid not null references public.profiles(id) on delete cascade,
  level text not null check (level in ('facil', 'medio', 'dificil')),
  status text not null default 'spinning'
    check (status in ('spinning', 'running', 'done', 'cancelled')),
  created_at timestamptz not null default now(),
  running_at timestamptz,
  ends_at timestamptz,
  settled_at timestamptz,
  is_success boolean
);

-- Uma roleta ativa por equipe (bloqueia os outros enquanto uma está rolando)
create unique index team_games_one_active
  on public.team_games (team_id) where status in ('spinning', 'running');
create index team_games_team_settled on public.team_games (team_id, settled_at);

create table public.team_game_players (
  game_id uuid not null references public.team_games(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  -- Posição no anel de nomes
  slot int not null,
  -- Casa sorteada no anel de desafios (0..7)
  challenge int,
  km numeric,
  pace_s int,
  assigned_at timestamptz,
  run_id uuid references public.runs(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  points int,
  primary key (game_id, user_id)
);
create index team_game_players_user on public.team_game_players (user_id, status);

-- Só pelas funções abaixo (security definer)
alter table public.team_games enable row level security;
alter table public.team_game_players enable row level security;
revoke all on public.team_games from anon, authenticated;
revoke all on public.team_game_players from anon, authenticated;

-- As 8 casas da roleta por nível (km, pace em s/km). Mais longe e mais
-- rápido no difícil; mais curto e mais leve no fácil.
create or replace function public.team_game_wheel(p_level text)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select case p_level
    when 'facil' then '[
      {"km":2,"pace":450},{"km":3,"pace":420},{"km":2,"pace":420},{"km":3,"pace":450},
      {"km":4,"pace":450},{"km":2,"pace":405},{"km":3,"pace":405},{"km":4,"pace":420}]'::jsonb
    when 'medio' then '[
      {"km":4,"pace":390},{"km":5,"pace":375},{"km":5,"pace":360},{"km":6,"pace":390},
      {"km":4,"pace":345},{"km":6,"pace":360},{"km":7,"pace":375},{"km":5,"pace":345}]'::jsonb
    else '[
      {"km":6,"pace":330},{"km":8,"pace":345},{"km":7,"pace":315},{"km":10,"pace":345},
      {"km":8,"pace":315},{"km":6,"pace":300},{"km":10,"pace":330},{"km":12,"pace":345}]'::jsonb
  end;
$$;

-- Quanto cada corredor soma (todos cumpriram) ou perde (falhou), por nível.
-- O difícil ganha e perde o dobro do fácil.
create or replace function public.team_game_stakes(p_level text)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select case p_level
    when 'facil' then '{"win":25,"lose":10}'::jsonb
    when 'medio' then '{"win":35,"lose":15}'::jsonb
    else '{"win":50,"lose":20}'::jsonb
  end;
$$;

-- Fecha a roleta: quem não correu até o fim do prazo falhou; com todos
-- resolvidos, distribui os pontos.
create or replace function public.team_game_settle(p_game uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  g public.team_games;
  stakes jsonb;
  has_fail boolean;
begin
  select * into g from public.team_games where id = p_game for update;
  if g.id is null or g.status <> 'running' then
    return;
  end if;

  if g.ends_at <= now() then
    update public.team_game_players set status = 'failed'
     where game_id = g.id and status = 'pending';
  end if;
  if exists (select 1 from public.team_game_players where game_id = g.id and status = 'pending') then
    return;
  end if;

  stakes := public.team_game_stakes(g.level);
  has_fail := exists (select 1 from public.team_game_players where game_id = g.id and status = 'failed');
  update public.team_game_players
     set points = case
       when not has_fail then (stakes ->> 'win')::int
       when status = 'failed' then -(stakes ->> 'lose')::int
       else 0
     end
   where game_id = g.id;
  update public.team_games
     set status = 'done', settled_at = now(), is_success = not has_fail
   where id = g.id;
end;
$$;

-- Limpa roletas largadas (girando há mais de 30 min) e fecha as vencidas
create or replace function public.team_game_tidy(p_team uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  gid uuid;
begin
  update public.team_games set status = 'cancelled'
   where team_id = p_team and status = 'spinning' and created_at < now() - interval '30 minutes';
  for gid in
    select id from public.team_games
     where team_id = p_team and status = 'running' and ends_at <= now()
  loop
    perform public.team_game_settle(gid);
  end loop;
end;
$$;

-- Estado da roleta da minha equipe: a ativa ou a última fechada (até 6 h)
create or replace function public.get_team_game()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  g public.team_games;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null then
    return null;
  end if;
  perform public.team_game_tidy(my_team);

  select * into g from public.team_games
   where team_id = my_team
     and (status in ('spinning', 'running')
          or (status = 'done' and settled_at > now() - interval '6 hours'))
   order by created_at desc limit 1;
  if g.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'id', g.id,
    'level', g.level,
    'status', g.status,
    'isStarter', g.started_by = uid,
    'starterName', (select coalesce(nullif(p.name, ''), 'Atleta') from public.profiles p where p.id = g.started_by),
    'createdAt', g.created_at,
    'endsAt', g.ends_at,
    'isSuccess', g.is_success,
    'wheel', public.team_game_wheel(g.level),
    'stakes', public.team_game_stakes(g.level),
    'players', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'userId', gp.user_id,
        'name', coalesce(nullif(p.name, ''), 'Atleta'),
        'avatarPath', p.avatar_path,
        'isYou', gp.user_id = uid,
        'slot', gp.slot,
        'challenge', gp.challenge,
        'km', gp.km,
        'pace', gp.pace_s,
        'assignedAt', gp.assigned_at,
        'status', gp.status,
        'points', gp.points
      ) order by gp.slot), '[]'::jsonb)
      from public.team_game_players gp
      join public.profiles p on p.id = gp.user_id
      where gp.game_id = g.id
    )
  );
end;
$$;

-- Chama a roleta: quem chamou + quem está online agora. Precisa de 2 ou mais.
create or replace function public.start_team_game(p_level text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  gid uuid;
  players int;
begin
  if p_level not in ('facil', 'medio', 'dificil') then
    raise exception 'invalid_level';
  end if;
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null then
    raise exception 'no_team';
  end if;
  perform public.team_game_tidy(my_team);
  if exists (select 1 from public.team_games where team_id = my_team and status in ('spinning', 'running')) then
    raise exception 'game_active';
  end if;

  insert into public.team_games (team_id, started_by, level)
  values (my_team, uid, p_level)
  returning id into gid;

  insert into public.team_game_players (game_id, user_id, slot)
  select gid, o.user_id, (row_number() over (order by random()))::int - 1
    from (
      select uid as user_id
      union
      select s.user_id
        from (
          select pp.user_id, pp.team_id from public.team_presence_pings pp
           where pp.at > now() - interval '10 minutes'
          union all
          select l.user_id, l.team_id from public.team_live_positions l
           where l.updated_at > now() - interval '10 minutes'
        ) s
        join public.team_members tm on tm.team_id = s.team_id and tm.user_id = s.user_id
       where s.team_id = my_team
    ) o;

  select count(*) into players from public.team_game_players where game_id = gid;
  if players < 2 then
    raise exception 'need_two';
  end if;

  return public.get_team_game();
end;
$$;

-- Um giro (só quem chamou): sorteia um nome ainda sem desafio e uma casa
create or replace function public.spin_team_game(p_game uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
  g public.team_games;
  pick uuid;
  idx int;
  cell jsonb;
begin
  select * into g from public.team_games where id = p_game for update;
  if g.id is null or g.started_by <> uid then
    raise exception 'not_starter';
  end if;
  if g.status <> 'spinning' then
    raise exception 'not_spinning';
  end if;

  select gp.user_id into pick from public.team_game_players gp
   where gp.game_id = g.id and gp.challenge is null
   order by random() limit 1;
  if pick is null then
    raise exception 'all_assigned';
  end if;

  idx := floor(random() * 8)::int;
  cell := public.team_game_wheel(g.level) -> idx;
  update public.team_game_players
     set challenge = idx, km = (cell ->> 'km')::numeric, pace_s = (cell ->> 'pace')::int,
         assigned_at = now()
   where game_id = g.id and user_id = pick;

  if not exists (select 1 from public.team_game_players where game_id = g.id and challenge is null) then
    update public.team_games
       set status = 'running', running_at = now(), ends_at = now() + interval '3 hours'
     where id = g.id;
  end if;

  return jsonb_build_object('userId', pick, 'challenge', idx, 'game', public.get_team_game());
end;
$$;

-- Desiste da roleta antes de terminar de girar (só quem chamou)
create or replace function public.cancel_team_game(p_game uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
begin
  update public.team_games set status = 'cancelled'
   where id = p_game and started_by = uid and status = 'spinning';
  return public.get_team_game();
end;
$$;

-- Corrida salva: confere o desafio da roleta (km e pace, com 2% e 5 s de
-- folga do GPS). Bateu → cumpriu; não bateu → falhou.
create or replace function public.on_run_team_game()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  gp public.team_game_players;
  pace numeric;
  is_ok boolean;
begin
  select p.* into gp
    from public.team_game_players p
    join public.team_games g on g.id = p.game_id
   where p.user_id = new.user_id and p.status = 'pending' and g.status = 'running'
     and p.assigned_at is not null and new.started_at >= p.assigned_at - interval '2 minutes'
   order by p.assigned_at desc limit 1;
  if gp.game_id is null then
    return new;
  end if;

  pace := case when new.distance_m > 0 then new.duration_s / (new.distance_m / 1000.0) end;
  is_ok := new.status = 'valid'
    and new.distance_m >= gp.km * 1000 * 0.98
    and pace is not null and pace <= gp.pace_s + 5;

  update public.team_game_players
     set status = case when is_ok then 'done' else 'failed' end, run_id = new.id
   where game_id = gp.game_id and user_id = gp.user_id;
  perform public.team_game_settle(gp.game_id);
  return new;
end;
$$;

create trigger runs_team_game
after insert on public.runs
for each row execute function public.on_run_team_game();

-- Pontos da roleta somados ao ranking da semana (nunca abaixo de zero)
create or replace function public.team_game_week_points(p_team_id uuid, p_from timestamptz, p_to timestamptz)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(gp.points), 0)
    from public.team_games g
    join public.team_game_players gp on gp.game_id = g.id
   where g.team_id = p_team_id and g.status = 'done'
     and g.settled_at >= p_from and g.settled_at < p_to;
$$;

create or replace function public.team_week_totals(p_week timestamptz)
returns table(team_id uuid, points bigint, km numeric)
language sql
stable
security definer
set search_path = ''
as $$
  select t.id,
         greatest(0, coalesce(sum(r.points), 0)
           + public.team_game_week_points(t.id, p_week, p_week + interval '7 days')),
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

create or replace function public.team_week_points(p_team_id uuid, p_week timestamptz)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select greatest(0, coalesce(sum(r.points), 0)
    + public.team_game_week_points(p_team_id, p_week, p_week + interval '7 days'))
    from public.runs r
   where r.team_id = p_team_id and r.status = 'valid'
     and r.started_at >= p_week and r.started_at < p_week + interval '7 days';
$$;

create or replace function public.team_week_days(p_team_id uuid, p_week timestamptz)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_agg(coalesce((
    select sum(r.points) from public.runs r
     where r.team_id = p_team_id and r.status = 'valid'
       and r.started_at >= p_week + (g.day * interval '1 day')
       and r.started_at < p_week + ((g.day + 1) * interval '1 day')
  ), 0) + public.team_game_week_points(
    p_team_id, p_week + (g.day * interval '1 day'), p_week + ((g.day + 1) * interval '1 day')
  ) order by g.day)
  from generate_series(0, 6) as g(day);
$$;

revoke execute on function public.team_game_settle(uuid) from public, anon, authenticated;
revoke execute on function public.team_game_tidy(uuid) from public, anon, authenticated;
revoke execute on function public.on_run_team_game() from public, anon, authenticated;
revoke execute on function public.team_game_week_points(uuid, timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.get_team_game() from public, anon;
revoke execute on function public.start_team_game(text) from public, anon;
revoke execute on function public.spin_team_game(uuid) from public, anon;
revoke execute on function public.cancel_team_game(uuid) from public, anon;
grant execute on function public.get_team_game() to authenticated;
grant execute on function public.start_team_game(text) to authenticated;
grant execute on function public.spin_team_game(uuid) to authenticated;
grant execute on function public.cancel_team_game(uuid) to authenticated;
grant execute on function public.team_game_wheel(text) to authenticated;
grant execute on function public.team_game_stakes(text) to authenticated;
