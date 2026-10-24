-- =============================================================================
-- PACE TEAM · colegas de equipe online agora
-- -----------------------------------------------------------------------------
-- Funcao nova (nada existente muda). "Online" = abriu o app nos ultimos
-- 15 minutos (o app registra em team_presence_pings ao abrir e ao voltar
-- para a frente). Usada no card "Correr junto" e na corrida ao vivo.
-- =============================================================================

create or replace function public.get_team_online()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', x.user_id,
    'name', x.name,
    'lastSeen', x.last_seen
  ) order by x.last_seen desc), '[]'::jsonb)
  from (
    select pp.user_id, p.name, max(pp.at) as last_seen
      from public.team_presence_pings pp
      join public.team_members me on me.team_id = pp.team_id and me.user_id = (select auth.uid())
      join public.team_members tm on tm.team_id = pp.team_id and tm.user_id = pp.user_id
      join public.profiles p on p.id = pp.user_id
     where pp.user_id <> (select auth.uid())
       and pp.at > now() - interval '15 minutes'
     group by pp.user_id, p.name
  ) x;
$$;

revoke execute on function public.get_team_online() from public, anon;
grant execute on function public.get_team_online() to authenticated;
