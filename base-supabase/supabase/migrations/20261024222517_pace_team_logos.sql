-- =============================================================================
-- PACE TEAM · escudo da equipe
-- -----------------------------------------------------------------------------
-- Bucket público "team-logos" (leitura pela URL). Só o capitão da equipe
-- envia, troca, lista ou apaga arquivos na pasta team-logos/<id da equipe>/.
-- A URL pública vai em teams.logo_url (o capitão já pode editar essa coluna).
-- Nada existente muda.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('team-logos', 'team-logos', true, 5242880, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- Capitão da equipe dona da pasta (primeiro nível do caminho = id da equipe)
create or replace function public.is_team_logo_owner(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.teams t
     where t.id::text = (storage.foldername(p_name))[1]
       and t.captain_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_team_logo_owner(text) from public, anon;
grant execute on function public.is_team_logo_owner(text) to authenticated;

create policy "team_logos_insert_captain" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'team-logos' and public.is_team_logo_owner(name));

create policy "team_logos_update_captain" on storage.objects
  for update to authenticated
  using (bucket_id = 'team-logos' and public.is_team_logo_owner(name))
  with check (bucket_id = 'team-logos' and public.is_team_logo_owner(name));

create policy "team_logos_select_captain" on storage.objects
  for select to authenticated
  using (bucket_id = 'team-logos' and public.is_team_logo_owner(name));

create policy "team_logos_delete_captain" on storage.objects
  for delete to authenticated
  using (bucket_id = 'team-logos' and public.is_team_logo_owner(name));
