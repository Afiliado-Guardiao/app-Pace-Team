-- Testes do build 33 (B33-1, B33-3, B33-6, B33-7):
-- 1. Feed: o percurso do post vem inteiro, mas só o desenho (sem GPS). O post
--    guarda o desenho e as fotos de quem correu junto, como na tela de postar.
-- 2. Corrida em grupo ao vivo: cada um manda quanto já correu; o 1º colocado
--    deixa o rastro dele para quem vem atrás seguir.
-- 3. Coroa: vai sozinha para o 1º do ranking da semana na equipe (o atleta
--    pode esconder). Os mini Buddies dos colegas mostram a coroa.
-- 4. Tempos do cartão do Buddy (para medir a demora dos botões no iPhone).

-- 1. Desenho do percurso ------------------------------------------------------

-- [lat, lng] → [dy, dx] a partir do 1º ponto (x já corrigido pela latitude).
-- Mantém o formato do traçado e não revela onde a corrida foi.
create or replace function public.route_shape(p_route jsonb)
returns jsonb
language sql
immutable
set search_path to ''
as $$
  with pts as (
    select (e ->> 0)::float8 as lat, (e ->> 1)::float8 as lng, t.ord
      from jsonb_array_elements(coalesce(p_route, '[]'::jsonb)) with ordinality as t(e, ord)
     where jsonb_typeof(e) = 'array'
  ),
  origin as (select lat as lat0, lng as lng0 from pts order by ord limit 1)
  select coalesce(jsonb_agg(jsonb_build_array(
           round((p.lat - o.lat0)::numeric, 6),
           round(((p.lng - o.lng0) * cos(radians(o.lat0)))::numeric, 6)
         ) order by p.ord), '[]'::jsonb)
    from pts p cross join origin o;
$$;

alter table public.posts add column if not exists art_route jsonb;
alter table public.posts add column if not exists art_crew jsonb;

-- O desenho que o app manda já vem sem GPS; mesmo assim o banco só aceita o
-- formato do desenho (perto de 0, nunca coordenada de verdade)
alter table public.posts drop constraint if exists posts_art_route_shape;
alter table public.posts add constraint posts_art_route_shape check (
  art_route is null or (
    jsonb_typeof(art_route) = 'array'
    and jsonb_array_length(art_route) <= 600
    and coalesce(abs((art_route -> 0 ->> 0)::float8), 0) < 0.0001
    and coalesce(abs((art_route -> 0 ->> 1)::float8), 0) < 0.0001
  )
);
alter table public.posts drop constraint if exists posts_art_crew_size;
alter table public.posts add constraint posts_art_crew_size check (
  art_crew is null or (jsonb_typeof(art_crew) = 'array' and jsonb_array_length(art_crew) <= 10)
);

grant insert (art_route, art_crew) on public.posts to authenticated;

create or replace function public.get_feed(p_limit integer default 30)
returns jsonb
language sql
security definer
set search_path to ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id,
    'authorId', f.user_id,
    'name', f.author,
    'avatarPath', f.avatar_path,
    'team', coalesce(f.team_name, ''),
    'teamId', f.team_id,
    'teamLogo', f.team_logo,
    'teamRank', f.team_rank,
    'scope', f.scope,
    'imagePath', f.image_path,
    'sample', f.sample,
    -- Números da corrida em si (o post guardava a distância arredondada)
    'seconds', coalesce(f.run_seconds, f.seconds),
    'km', coalesce(f.run_km, f.km),
    'route', f.route,
    'crew', coalesce(f.art_crew, '[]'::jsonb),
    'layers', f.layers,
    'caption', f.caption,
    'createdAt', f.created_at,
    'likes', f.likes,
    'isLiked', f.is_liked,
    'isMine', f.user_id = (select auth.uid())
  ) order by f.created_at desc), '[]'::jsonb)
  from (
    select po.*,
           p.name as author,
           p.avatar_path,
           t.name as team_name,
           t.logo_url as team_logo,
           case when t.id is not null then public.team_city_position(t.id, public.week_start()) end as team_rank,
           r.duration_s as run_seconds,
           round(r.distance_m / 1000.0, 3) as run_km,
           -- Percurso inteiro, só o desenho (nunca as coordenadas): o que o
           -- post guardou ou, nos posts antigos, o da corrida do autor
           case
             when po.art_route is not null then po.art_route
             when r.id is null or r.user_id <> po.user_id then '[]'::jsonb
             else public.route_shape(r.route)
           end as route,
           (select count(*) from public.post_likes l where l.post_id = po.id) as likes,
           exists (select 1 from public.post_likes l where l.post_id = po.id and l.user_id = (select auth.uid())) as is_liked
      from public.posts po
      join public.profiles p on p.id = po.user_id
      left join public.teams t on t.id = po.team_id
      left join public.runs r on r.id = po.run_id
     where not exists (
             select 1 from public.user_blocks b
              where (b.blocker_id = (select auth.uid()) and b.blocked_id = po.user_id)
                 or (b.blocker_id = po.user_id and b.blocked_id = (select auth.uid()))
           )
       and not exists (
             select 1 from public.post_reports rp
              where rp.post_id = po.id and rp.reporter_id = (select auth.uid())
           )
       and (
             po.user_id = (select auth.uid())
             or (select count(*) from public.post_reports rp where rp.post_id = po.id) < 3
           )
     order by po.created_at desc
     limit least(greatest(p_limit, 1), 100)
  ) f;
$$;

-- 2. Corrida em grupo ao vivo: distância e rastro do líder --------------------

alter table public.team_live_positions add column if not exists meters double precision not null default 0;
alter table public.team_live_positions add column if not exists trail jsonb not null default '[]'::jsonb;

-- O app antigo chama com 2 parâmetros: o 3º tem padrão (sem distância = 0)
drop function if exists public.set_live_position(double precision, double precision);
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
  insert into public.team_live_positions (user_id, team_id, lat, lng, meters, trail, updated_at)
  values (uid, my_team, p_lat, p_lng, greatest(coalesce(p_meters, 0), 0), jsonb_build_array(point), now())
  on conflict (user_id) do update
    set team_id = excluded.team_id,
        lat = excluded.lat,
        lng = excluded.lng,
        meters = greatest(coalesce(p_meters, team_live_positions.meters), 0),
        -- Parado há mais de 10 min = corrida nova: o rastro recomeça. Guarda
        -- no máximo os 720 pontos mais novos (1 h a cada 5 s)
        trail = case
          when team_live_positions.updated_at < now() - interval '10 minutes' then jsonb_build_array(point)
          else (
            select coalesce(jsonb_agg(x.e order by x.ord), '[]'::jsonb)
              from jsonb_array_elements(team_live_positions.trail || jsonb_build_array(point))
                   with ordinality as x(e, ord)
             where x.ord > jsonb_array_length(team_live_positions.trail) + 1 - 720
          )
        end,
        updated_at = now();
end;
$$;
revoke all on function public.set_live_position(double precision, double precision, double precision) from public, anon;
grant execute on function public.set_live_position(double precision, double precision, double precision) to authenticated;

-- Colegas correndo agora: posição, quanto já correu e, só do que vai na
-- frente (entre os colegas), o rastro para quem vem atrás seguir
create or replace function public.get_team_live_positions()
returns jsonb
language sql
stable
security definer
set search_path to ''
as $$
  with live as (
    select l.*, p.name, p.avatar_path,
           row_number() over (order by l.meters desc, l.updated_at) as place
      from public.team_live_positions l
      join public.team_members me on me.team_id = l.team_id and me.user_id = (select auth.uid())
      join public.profiles p on p.id = l.user_id
     where l.user_id <> (select auth.uid())
       and l.updated_at > now() - interval '10 minutes'
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'userId', l.user_id,
    'name', coalesce(nullif(l.name, ''), 'Atleta'),
    'avatarPath', l.avatar_path,
    'lat', l.lat,
    'lng', l.lng,
    'meters', round(l.meters::numeric, 1),
    'trail', case when l.place = 1 then l.trail else '[]'::jsonb end,
    'at', l.updated_at
  ) order by l.name), '[]'::jsonb)
  from live l;
$$;
revoke all on function public.get_team_live_positions() from public, anon;
grant execute on function public.get_team_live_positions() to authenticated;

-- 3. Coroa do 1º da equipe -------------------------------------------------------

alter table public.buddy_profiles add column if not exists hide_crown boolean not null default false;
grant insert (hide_crown) on public.buddy_profiles to authenticated;
grant update (hide_crown) on public.buddy_profiles to authenticated;

-- 1º do ranking da semana dentro da equipe (pontos das corridas válidas; sem
-- pontos ainda, ninguém tem a coroa)
create or replace function public.team_top_member(p_team uuid)
returns uuid
language sql
stable
security definer
set search_path to ''
as $$
  select m.user_id
    from public.team_members m
    join public.runs r on r.user_id = m.user_id and r.team_id = m.team_id
   where m.team_id = p_team
     and r.status = 'valid'
     and r.started_at >= public.week_start()
   group by m.user_id, m.joined_at
  having sum(r.points) > 0
   order by sum(r.points) desc, sum(r.distance_m) desc, m.joined_at
   limit 1;
$$;
revoke all on function public.team_top_member(uuid) from public, anon, authenticated;

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
    -- A coroa agora é à parte: não vem mais na lista de acessórios
    'equipped', coalesce(to_jsonb(array_remove(x.equipped, 'coroa')), '[]'::jsonb),
    'crown', x.user_id = public.team_top_member(x.team_id) and not coalesce(x.hide_crown, false)
  ) order by x.last_seen desc), '[]'::jsonb)
  from (
    select s.user_id, s.team_id, p.name, p.avatar_path, b.color, b.last_free, b.equipped, b.hide_crown,
           max(s.at) as last_seen
      from (
        select pp.user_id, pp.team_id, pp.at
          from public.team_presence_pings pp
         where pp.at > now() - interval '3 minutes'
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

-- 4. Tempos do cartão do Buddy ----------------------------------------------------

create table if not exists public.buddy_timings (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  events jsonb not null check (jsonb_typeof(events) = 'array' and jsonb_array_length(events) <= 200),
  created_at timestamptz not null default now()
);
alter table public.buddy_timings enable row level security;
revoke all on public.buddy_timings from anon, authenticated;
grant insert (events) on public.buddy_timings to authenticated;
create policy "buddy_timings_insert_own" on public.buddy_timings
  for insert to authenticated with check (user_id = (select auth.uid()));
