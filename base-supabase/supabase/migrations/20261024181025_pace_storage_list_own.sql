-- =============================================================================
-- PACE TEAM · listar os próprios arquivos no Storage
-- -----------------------------------------------------------------------------
-- Ao excluir a conta e ao trocar a foto de perfil, o app lista a pasta do
-- atleta para apagar os arquivos. O list() do Storage precisa de policy de
-- select; sem ela a lista volta vazia e as fotos ficariam órfãs. As fotos
-- continuam públicas pela URL (buckets públicos); aqui o atleta só enxerga a
-- listagem da própria pasta.
-- =============================================================================

create policy "avatars_select_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "post_photos_select_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'post-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
