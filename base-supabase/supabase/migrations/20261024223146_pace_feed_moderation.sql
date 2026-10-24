-- =============================================================================
-- PACE TEAM · denunciar posts e bloquear atletas (regra 1.2 da App Store)
-- -----------------------------------------------------------------------------
-- Apps com conteúdo postado por usuários precisam de: denúncia, bloqueio e
-- filtro do que foi denunciado. Nada existente é apagado.
-- - post_reports: uma denúncia por atleta e post (com o motivo). Só o banco e
--   o painel do Supabase leem; o responsável revisa por lá.
-- - user_blocks: quem eu bloqueei. Posts de quem eu bloqueei (ou de quem me
--   bloqueou) somem do meu feed.
-- - get_feed: além disso, esconde posts que eu denunciei e posts com 3 ou
--   mais denúncias (até a revisão), e passa a devolver authorId.
-- =============================================================================

create table public.post_reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts (id) on delete cascade,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason      text not null check (reason in ('ofensivo', 'nudez', 'spam', 'fraude', 'outro')),
  created_at  timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create index post_reports_reporter_idx on public.post_reports (reporter_id);

create table public.user_blocks (
  blocker_id uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create index user_blocks_blocked_idx on public.user_blocks (blocked_id);

alter table public.post_reports enable row level security;
alter table public.user_blocks  enable row level security;

revoke all on public.post_reports from anon, authenticated;
revoke all on public.user_blocks  from anon, authenticated;
grant select, delete on public.user_blocks to authenticated;

-- post_reports: só via RPC (sem policy para o app)
create policy "user_blocks_select_own" on public.user_blocks
  for select to authenticated using ((select auth.uid()) = blocker_id);
create policy "user_blocks_delete_own" on public.user_blocks
  for delete to authenticated using ((select auth.uid()) = blocker_id);

create or replace function public.report_post(p_post_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
begin
  if not exists (select 1 from public.posts where id = p_post_id) then
    raise exception 'post_not_found';
  end if;
  insert into public.post_reports (post_id, reporter_id, reason)
  values (p_post_id, uid, coalesce(nullif(p_reason, ''), 'outro'))
  on conflict (post_id, reporter_id) do update set reason = excluded.reason, created_at = now();
end;
$$;

create or replace function public.block_user(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := public.require_uid();
begin
  if p_user_id = uid then
    raise exception 'invalid_user';
  end if;
  insert into public.user_blocks (blocker_id, blocked_id)
  values (uid, p_user_id)
  on conflict do nothing;
end;
$$;

create or replace function public.get_feed(p_limit integer default 30)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id,
    'authorId', f.user_id,
    'name', f.author,
    'team', coalesce(f.team_name, ''),
    'teamId', f.team_id,
    'imagePath', f.image_path,
    'sample', f.sample,
    'seconds', f.seconds,
    'km', f.km,
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
           t.name as team_name,
           (select count(*) from public.post_likes l where l.post_id = po.id) as likes,
           exists (select 1 from public.post_likes l where l.post_id = po.id and l.user_id = (select auth.uid())) as is_liked
      from public.posts po
      join public.profiles p on p.id = po.user_id
      left join public.teams t on t.id = po.team_id
     where not exists (
             select 1 from public.user_blocks b
              where (b.blocker_id = (select auth.uid()) and b.blocked_id = po.user_id)
                 or (b.blocker_id = po.user_id and b.blocked_id = (select auth.uid()))
           )
       and not exists (
             select 1 from public.post_reports r
              where r.post_id = po.id and r.reporter_id = (select auth.uid())
           )
       and (
             po.user_id = (select auth.uid())
             or (select count(*) from public.post_reports r where r.post_id = po.id) < 3
           )
     order by po.created_at desc
     limit least(greatest(p_limit, 1), 100)
  ) f;
$$;

revoke execute on function public.report_post(uuid, text) from public, anon;
revoke execute on function public.block_user(uuid)        from public, anon;
grant execute on function public.report_post(uuid, text) to authenticated;
grant execute on function public.block_user(uuid)        to authenticated;
