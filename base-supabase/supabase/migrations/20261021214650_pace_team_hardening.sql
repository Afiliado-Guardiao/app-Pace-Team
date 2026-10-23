-- =============================================================================
-- PACE TEAM · reforco de seguranca (apontado pelos advisors do Supabase)
-- -----------------------------------------------------------------------------
-- - Funcoes de trigger e auxiliares internas nao ficam chamaveis pela API.
-- - RPCs que exigem login nao ficam chamaveis sem sessao (role anon).
-- - search_path fixo nas funcoes utilitarias do template.
-- =============================================================================

revoke execute on function public.handle_new_user()             from public, anon, authenticated;
revoke execute on function public.handle_user_metadata_update() from public, anon, authenticated;
revoke execute on function public.validate_run()                from public, anon, authenticated;
revoke execute on function public.team_week_totals(timestamptz) from public, anon, authenticated;

revoke execute on function public.apply_referral_code(text) from public, anon;
revoke execute on function public.get_referral_stats()      from public, anon;
revoke execute on function public.delete_account()          from public, anon;

alter function public.set_updated_at()              set search_path = '';
alter function public.generate_referral_code()      set search_path = '';
alter function public.normalize_referral_code(text) set search_path = '';
