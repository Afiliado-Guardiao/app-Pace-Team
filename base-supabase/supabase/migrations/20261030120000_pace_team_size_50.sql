-- Equipe de qualquer tamanho, de 2 a 50 integrantes: além dos atalhos (2, 3,
-- 5 e 10), o capitão escolhe o número em "Outra". O ranking continua
-- comparando equipes do mesmo tamanho.

alter table public.teams drop constraint if exists teams_size_check;
alter table public.teams add constraint teams_size_check check (size between 2 and 50);
