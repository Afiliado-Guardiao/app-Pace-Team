-- =============================================================================
-- PACE TEAM · corridas (e rotas GPS) visíveis só para o próprio atleta
-- -----------------------------------------------------------------------------
-- Antes, a policy "runs_select_own_or_team" deixava os colegas de equipe ler
-- as linhas de runs pela API — inclusive a coluna route (o percurso GPS). O
-- app nunca mostra a rota de outra pessoa: ranking, equipe, Modo Virada e
-- "corrida da equipe" usam funções security definer que não devolvem a rota.
-- Agora cada atleta lê só as próprias corridas, como diz a Política de
-- Privacidade. Nenhum dado muda; só a regra de leitura.
-- =============================================================================

drop policy if exists "runs_select_own_or_team" on public.runs;

create policy "runs_select_own" on public.runs
  for select to authenticated
  using ((select auth.uid()) = user_id);
