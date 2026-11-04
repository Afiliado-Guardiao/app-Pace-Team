-- Testes do build 34 (B34-1, B34-3, B34-4):
-- 1. Online: vale por 10 min depois do último sinal (app aberto ou em segundo
--    plano, Buddy chamado, correndo). Sair do app não derruba mais na hora.
-- 2. Corrida em grupo: quem termina primeiro já vê o colega que ainda está
--    correndo (foto, percurso e distância até agora).
-- 3. "Fulano concluiu uma corrida": vai em toda corrida em grupo de verdade
--    (≥ 30 s e ≥ 30 m), mesmo sem validar. Cada envio fica registrado.

-- 1. Online por 10 min -----------------------------------------------------------

create or replace function public.get_team_online()
returns jsonb
language sql
stable
security definer
set search_path to ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', x.user_id,
    'name', x.name,
    'avatarPath', x.avatar_path,
    'lastSeen', x.last_seen,
    'color', case
      when x.color in ('bronze', 'prata', 'ouro') and x.color is distinct from (
        case public.team_city_position(x.team_id, public.week_start())
          when 1 then 'ouro' when 2 then 'prata' when 3 then 'bronze' end
      ) then coalesce(x.last_free, 'branco')
      else coalesce(x.color, 'branco')
    end,
    'equipped', coalesce(to_jsonb(array_remove(x.equipped, 'coroa')), '[]'::jsonb),
    'crown', x.user_id = public.team_top_member(x.team_id) and not coalesce(x.hide_crown, false)
  ) order by x.last_seen desc), '[]'::jsonb)
  from (
    select s.user_id, s.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped, b.hide_crown,
           max(s.at) as last_seen
      from (
        select pp.user_id, pp.team_id, pp.at
          from public.team_presence_pings pp
         where pp.at > now() - interval '10 minutes'
        union all
        select l.user_id, l.team_id, l.updated_at
          from public.team_live_positions l
         where l.updated_at > now() - interval '10 minutes'
      ) s
      join public.team_members me on me.team_id = s.team_id and me.user_id = (select auth.uid())
      join public.team_members tm on tm.team_id = s.team_id and tm.user_id = s.user_id
      join public.profiles p on p.id = s.user_id
      left join public.buddy_profiles b on b.user_id = s.user_id
     where s.user_id <> (select auth.uid())
     group by s.user_id, s.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped, b.hide_crown
  ) x;
$$;

-- 2. Colega que ainda está correndo -----------------------------------------------

alter table public.team_live_positions add column if not exists started_at timestamptz not null default now();

create or replace function public.set_live_position(
  p_lat double precision,
  p_lng double precision,
  p_meters double precision default null
)
returns void
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  point jsonb;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  if my_team is null or p_lat not between -90 and 90 or p_lng not between -180 and 180 then
    return;
  end if;
  point := jsonb_build_array(round(p_lat::numeric, 6), round(p_lng::numeric, 6));
  insert into public.team_live_positions (user_id, team_id, lat, lng, meters, trail, started_at, updated_at)
  values (uid, my_team, p_lat, p_lng, greatest(coalesce(p_meters, 0), 0), jsonb_build_array(point), now(), now())
  on conflict (user_id) do update
    set team_id = excluded.team_id,
        lat = excluded.lat,
        lng = excluded.lng,
        meters = greatest(coalesce(p_meters, team_live_positions.meters), 0),
        -- Parado há mais de 10 min = corrida nova: rastro e início recomeçam.
        -- Guarda no máximo os 720 pontos mais novos (1 h a cada 5 s)
        trail = case
          when team_live_positions.updated_at < now() - interval '10 minutes' then jsonb_build_array(point)
          else (
            select coalesce(jsonb_agg(x.e order by x.ord), '[]'::jsonb)
              from jsonb_array_elements(team_live_positions.trail || jsonb_build_array(point))
                   with ordinality as x(e, ord)
             where x.ord > jsonb_array_length(team_live_positions.trail) + 1 - 720
          )
        end,
        started_at = case
          when team_live_positions.updated_at < now() - interval '10 minutes' then now()
          else team_live_positions.started_at
        end,
        updated_at = now();
end;
$$;
revoke all on function public.set_live_position(double precision, double precision, double precision) from public, anon;
grant execute on function public.set_live_position(double precision, double precision, double precision) to authenticated;

-- Corrida da equipe: quem salvou a corrida no mesmo horário e também quem da
-- equipe ainda está correndo agora (isLive, números até o momento)
create or replace function public.get_team_run(p_run_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  my_team uuid;
  r public.runs;
  saved jsonb;
  live jsonb;
begin
  select m.team_id into my_team from public.team_members m where m.user_id = uid;
  select * into r from public.runs where id = p_run_id;
  if r.id is null or (r.user_id <> uid and (my_team is null or r.team_id is distinct from my_team)) then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', o.user_id,
    'name', coalesce(nullif(p.name, ''), 'Atleta'),
    'avatarPath', p.avatar_path,
    'isYou', o.user_id = uid,
    'isLive', false,
    'km', round(o.distance_m / 1000.0, 2),
    'seconds', o.duration_s,
    'route', public.visible_route(o, uid)
  ) order by o.distance_m desc), '[]'::jsonb)
    into saved
    from public.runs o
    join public.profiles p on p.id = o.user_id
   where r.team_id is not null and o.team_id = r.team_id and o.id <> r.id
     and o.user_id <> r.user_id
     and o.started_at < r.finished_at + interval '10 minutes'
     and o.finished_at > r.started_at - interval '10 minutes';

  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', l.user_id,
    'name', coalesce(nullif(p.name, ''), 'Atleta'),
    'avatarPath', p.avatar_path,
    'isYou', l.user_id = uid,
    'isLive', true,
    'km', round((l.meters / 1000.0)::numeric, 2),
    'seconds', greatest(0, round(extract(epoch from (l.updated_at - l.started_at))))::int,
    'route', l.trail
  ) order by l.meters desc), '[]'::jsonb)
    into live
    from public.team_live_positions l
    join public.profiles p on p.id = l.user_id
   where r.team_id is not null and l.team_id = r.team_id
     and l.user_id <> r.user_id
     and l.updated_at > now() - interval '10 minutes'
     and l.started_at < r.finished_at + interval '10 minutes'
     -- Quem já salvou aparece com a corrida salva, não com a ao vivo
     and not exists (
       select 1 from public.runs o
        where o.user_id = l.user_id and o.team_id = r.team_id
          and o.started_at < r.finished_at + interval '10 minutes'
          and o.finished_at > r.started_at - interval '10 minutes'
     );

  return jsonb_build_object(
    'id', r.id,
    'userId', r.user_id,
    'name', (select coalesce(nullif(p.name, ''), 'Atleta') from public.profiles p where p.id = r.user_id),
    'avatarPath', (select p.avatar_path from public.profiles p where p.id = r.user_id),
    'isYou', r.user_id = uid,
    'startedAt', r.started_at,
    'seconds', r.duration_s,
    'km', round(r.distance_m / 1000.0, 2),
    'points', r.points,
    'status', r.status,
    'mode', r.mode,
    'route', public.visible_route(r, uid),
    'mates', saved || live
  );
end;
$$;
revoke all on function public.get_team_run(uuid) from public, anon;
grant execute on function public.get_team_run(uuid) to authenticated;

-- 3. "Fulano concluiu uma corrida" e registro dos envios --------------------------

-- Toda corrida em grupo de verdade avisa a equipe, validada ou não; só o
-- toque sem querer (< 30 s ou < 30 m) fica de fora. Uma vez por corrida, até
-- 1 h depois de terminar.
create or replace function public.team_run_push_targets(p_run_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $$
declare
  uid uuid := public.require_uid();
  r public.runs;
  author text;
  distance text;
begin
  update public.runs
     set pushed_at = now()
   where id = p_run_id and user_id = uid and pushed_at is null
     and team_id is not null
     and duration_s >= 30 and distance_m >= 30
     and coalesce(finished_at, created_at) > now() - interval '1 hour'
  returning * into r;
  if r.id is null then
    return jsonb_build_object('recipients', '[]'::jsonb);
  end if;

  select coalesce(nullif(p.name, ''), 'Atleta') into author from public.profiles p where p.id = uid;
  distance := case
    when r.distance_m < 1000 then round(r.distance_m)::int || ' m'
    else public.fmt_km(r.distance_m) || ' km'
  end;

  return jsonb_build_object(
    'runId', r.id,
    'title', author || ' concluiu uma corrida',
    'body', distance || ' em ' || public.fmt_clock(r.duration_s)
      || case when r.status = 'valid' and r.points > 0 then ' · +' || r.points || ' pts para o time' else '' end,
    'recipients', (
      select coalesce(jsonb_agg(jsonb_build_object('userId', d.user_id, 'token', d.token)), '[]'::jsonb)
        from public.team_members tm
        join public.device_tokens d on d.user_id = tm.user_id
       where tm.team_id = r.team_id and tm.user_id <> uid
    )
  );
end;
$$;
revoke all on function public.team_run_push_targets(uuid) from public, anon;
grant execute on function public.team_run_push_targets(uuid) to authenticated;

-- Resultado de cada push enviado (ok ou o erro da Expo). Só as Edge Functions
-- (service_role) escrevem; ninguém lê pelo app.
create table if not exists public.push_log (
  id bigint generated always as identity primary key,
  kind text not null,
  from_user uuid references auth.users (id) on delete set null,
  to_user uuid references auth.users (id) on delete set null,
  status text not null,
  error text,
  ticket_id text,
  created_at timestamptz not null default now()
);
alter table public.push_log enable row level security;
revoke all on public.push_log from anon, authenticated;
create index if not exists push_log_created_idx on public.push_log (created_at desc);
