-- =============================================================================
-- PACE TEAM · privilegios por coluna de verdade (tabelas anteriores ao Buddy)
-- -----------------------------------------------------------------------------
-- O Supabase da a anon/authenticated todos os privilegios em toda tabela nova
-- de public (default privileges). Sem revogar antes, os "grant ... (colunas)"
-- das migrations init e pace_team_core nao restringiam nada: um usuario logado
-- conseguia gravar profiles.is_premium / referral_code / referred_by_id no
-- proprio perfil, e o capitao conseguia gravar teams.size / captain_id /
-- invite_code direto, sem passar pelas funcoes.
-- Aqui cada tabela fica so com o que aquelas migrations ja pretendiam. Nao ha
-- mudanca de schema nem de dados; service_role e as funcoes security definer
-- (dono postgres) seguem com acesso total.
-- =============================================================================

revoke all on public.profiles       from anon, authenticated;
revoke all on public.onboardings    from anon, authenticated;
revoke all on public.subscriptions  from anon, authenticated;
revoke all on public.webhook_events from anon, authenticated;
revoke all on public.teams          from anon, authenticated;
revoke all on public.team_members   from anon, authenticated;
revoke all on public.team_invites   from anon, authenticated;
revoke all on public.runs           from anon, authenticated;
revoke all on public.posts          from anon, authenticated;
revoke all on public.post_likes     from anon, authenticated;

-- init
grant select                          on public.profiles      to authenticated;
grant update (name, birthday, city, state) on public.profiles to authenticated;
grant select, insert, update, delete  on public.onboardings   to authenticated;
grant select                          on public.subscriptions to authenticated;

-- pace_team_core
grant select                              on public.teams        to authenticated;
grant update (name, city, region, state, description, logo_url) on public.teams to authenticated;
grant select                              on public.team_members to authenticated;
grant select                              on public.team_invites to authenticated;
grant select, delete                      on public.runs         to authenticated;
grant insert (mode, started_at, finished_at, duration_s, distance_m, route) on public.runs to authenticated;
grant select, delete                      on public.posts        to authenticated;
grant insert (team_id, run_id, image_path, sample, seconds, km, layers, caption) on public.posts to authenticated;
grant select, insert, delete              on public.post_likes   to authenticated;

-- webhook_events: so service_role (Edge Function do webhook).
