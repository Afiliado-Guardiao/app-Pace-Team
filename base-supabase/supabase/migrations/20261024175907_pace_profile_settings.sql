-- =============================================================================
-- PACE TEAM · editar perfil, foto, privacidade e excluir conta
-- -----------------------------------------------------------------------------
-- - profiles ganha avatar_path (foto no bucket "avatars") e privacy (jsonb com
--   as 4 chaves da folha Privacidade). Nada existente e apagado; os perfis
--   atuais recebem os valores padrao do design.
-- - O atleta pode editar handle (@), avatar_path e privacy, alem de
--   name/birthday/city/state que ja eram editaveis.
-- - search_athletes passa a respeitar a privacidade: perfil "fora da equipe"
--   desligado nao aparece na busca, e a cidade so aparece se showCity.
-- - delete_account: antes de apagar o usuario, sai da equipe (passa a
--   capitania ou apaga a equipe vazia), para nao deixar equipe sem capitao.
-- =============================================================================

alter table public.profiles
  add column avatar_path text,
  add column privacy jsonb not null default
    '{"showCity": true, "publicProfile": true, "shareRoutes": false, "hideRouteEnds": true}'::jsonb;

-- @ do atleta: 3 a 20 caracteres, letras minusculas, numeros, ponto e "_".
alter table public.profiles
  add constraint profiles_handle_format
  check (handle is null or handle ~ '^[a-z0-9._]{3,20}$');

alter table public.profiles
  add constraint profiles_privacy_shape
  check (
    jsonb_typeof(privacy) = 'object'
    and privacy ?& array['showCity', 'publicProfile', 'shareRoutes', 'hideRouteEnds']
  );

grant update (handle, avatar_path, privacy) on public.profiles to authenticated;

-- -----------------------------------------------------------------------------
-- Storage: fotos de perfil (leitura publica, escrita so na pasta do proprio uid)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- -----------------------------------------------------------------------------
-- Busca de atletas respeitando a privacidade
-- -----------------------------------------------------------------------------
create or replace function public.search_athletes(p_query text)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'handle', coalesce(
      '@' || p.handle,
      case when (p.privacy ->> 'showCity')::boolean then p.city end,
      ''
    ),
    'hasTeam', exists (select 1 from public.team_members m where m.user_id = p.id)
  )), '[]'::jsonb)
  from (
    select * from public.profiles p
     where p.id <> (select auth.uid())
       and p.name <> ''
       and (p.privacy ->> 'publicProfile')::boolean
       and (
         coalesce(trim(p_query), '') = ''
         or p.name ilike '%' || trim(p_query) || '%'
         or p.handle ilike '%' || ltrim(trim(p_query), '@') || '%'
       )
     order by p.created_at desc
     limit 12
  ) p;
$$;

-- -----------------------------------------------------------------------------
-- Excluir conta: sai da equipe antes (capitania passa ao mais antigo)
-- -----------------------------------------------------------------------------
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

  perform public.leave_team();
  delete from auth.users where id = v_uid;
end;
$$;

revoke execute on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;
