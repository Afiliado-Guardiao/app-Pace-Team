-- =============================================================================
-- PACE TEAM · o post herda a equipe atual do autor
-- -----------------------------------------------------------------------------
-- Autor e equipe vem da sessao, nunca do cliente (feed mostra o nome do time).
-- =============================================================================

create or replace function public.fill_post_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.user_id := (select auth.uid());
  select tm.team_id into new.team_id
    from public.team_members tm
   where tm.user_id = new.user_id;
  return new;
end;
$$;

revoke execute on function public.fill_post_author() from public, anon, authenticated;

create trigger posts_fill_author
  before insert on public.posts
  for each row execute function public.fill_post_author();
