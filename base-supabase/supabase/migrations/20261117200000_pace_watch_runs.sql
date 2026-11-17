-- =============================================================================
-- PACE TEAM — corridas do relógio (Apple Saúde)
-- =============================================================================
-- O app lê as corridas que o relógio (Apple Watch, Garmin, Polar, Coros…)
-- salvou no app Saúde e manda para cá. Elas valem ponto com as MESMAS regras
-- das corridas do app (mínimo 1 min e 100 m, até 25 km/h). Para não contar
-- duas vezes nem virar atalho de trapaça:
--   * a mesma corrida do app Saúde (external_id) só entra uma vez;
--   * corrida no mesmo horário de outra já salva (app ou outro relógio) é
--     recusada;
--   * só corridas recentes (últimos 14 dias) e que já terminaram.
-- O app só busca a partir do dia em que o atleta conectou o relógio.

alter table public.runs
  add column if not exists source text not null default 'app'
    check (source in ('app', 'watch')),
  add column if not exists external_id text
    check (external_id is null or char_length(external_id) <= 80),
  add column if not exists avg_hr smallint
    check (avg_hr is null or avg_hr between 30 and 250),
  add column if not exists device_name text
    check (device_name is null or char_length(device_name) <= 60);

create unique index if not exists runs_user_external_uidx
  on public.runs (user_id, external_id)
  where external_id is not null;

grant insert (source, external_id, avg_hr, device_name) on public.runs to authenticated;

create or replace function public.validate_run()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  avg_speed numeric;
begin
  new.user_id := (select auth.uid());
  select tm.team_id into new.team_id
    from public.team_members tm
   where tm.user_id = new.user_id;

  -- Corrida do relógio: precisa do código do app Saúde, já ter terminado, ser
  -- recente e não bater no horário de outra corrida já salva
  if new.source = 'watch' then
    if new.external_id is null
       or new.finished_at > now() + interval '5 minutes'
       or new.finished_at < new.started_at
       or new.started_at < now() - interval '14 days' then
      raise exception 'watch_run_rejected';
    end if;
    if exists (
      select 1 from public.runs r
       where r.user_id = new.user_id
         and r.started_at < new.finished_at
         and r.finished_at > new.started_at
    ) then
      raise exception 'duplicate_run';
    end if;
  else
    new.external_id := null;
    new.avg_hr := null;
    new.device_name := null;
  end if;

  avg_speed := case when new.duration_s > 0 then new.distance_m / new.duration_s else 0 end;

  if new.duration_s < 60 or new.distance_m < 100 or avg_speed > 7 then
    new.status := 'invalid';
    new.points := 0;
  else
    new.status := 'valid';
    new.points := public.run_points(new.distance_m);
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_run() from public, anon, authenticated;
