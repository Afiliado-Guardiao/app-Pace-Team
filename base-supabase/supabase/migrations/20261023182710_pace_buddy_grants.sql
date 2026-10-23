-- =============================================================================
-- PACE TEAM · Pace Buddy: privilegios por coluna de verdade
-- -----------------------------------------------------------------------------
-- O Supabase da a anon/authenticated todos os privilegios em toda tabela nova
-- de public (default privileges). Sem revogar antes, os "grant ... (colunas)"
-- da migration pace_buddy nao restringiam nada: o app conseguia gravar
-- buddy_profiles.goals direto, sem passar pela RPC buddy_complete_goal.
-- Aqui as tabelas do Buddy ficam so com o que o app precisa.
-- =============================================================================

revoke all on public.buddy_profiles        from anon, authenticated;
revoke all on public.device_tokens         from anon, authenticated;
revoke all on public.team_presence_pings   from anon, authenticated;
revoke all on public.buddy_notify_throttle from anon, authenticated;

grant select on public.buddy_profiles to authenticated;
grant insert (goals, color, last_free, equipped, alarm_time, alarm_days) on public.buddy_profiles to authenticated;
grant update (color, last_free, equipped, alarm_time, alarm_days)        on public.buddy_profiles to authenticated;

grant select, delete on public.device_tokens to authenticated;
grant insert (token, platform) on public.device_tokens to authenticated;
grant update (platform)        on public.device_tokens to authenticated;

grant select on public.team_presence_pings to authenticated;

-- buddy_notify_throttle: so backend (security definer e service_role).
