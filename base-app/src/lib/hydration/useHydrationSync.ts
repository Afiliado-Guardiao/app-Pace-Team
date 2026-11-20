import { useEffect } from "react";

import { formatMl } from "./day";
import { scheduleHydrationReminders, schedulePostRunReminder } from "./notifications";
import { useHydrationStore } from "./store";
import { useHydration } from "./useHydration";

// Corrida que acabou há até 2 h ganha o aviso de reposição
const POST_RUN_WINDOW_MS = 2 * 3_600_000;
const ignore = (): undefined => undefined;

// PACE HYDRATION fora da tela: reagenda os lembretes quando mudam (e quando
// muda quanto falta beber, para o texto dizer o valor certo) e manda o
// aviso de reposição quando uma corrida nova aparece. Montado na área logada.
export const useHydrationSync = (): void => {
	const hydro = useHydration();
	const reminders = useHydrationStore((s) => s.reminders);
	const notified = useHydrationStore((s) => s.notifiedRuns);
	const markRunNotified = useHydrationStore((s) => s.markRunNotified);
	const { isPro, lastRun, hasRestriction, remainingMl, baseMl } = hydro;
	// Arredonda em 50 ml: o lembrete não é refeito a cada mililitro
	const todayMl = hasRestriction ? null : Math.ceil(remainingMl / 50) * 50;
	const dayMl = hasRestriction ? null : Math.ceil(baseMl / 50) * 50;

	useEffect(() => {
		scheduleHydrationReminders(reminders, isPro, { todayMl, dayMl }).catch(ignore);
	}, [reminders, isPro, todayMl, dayMl]);

	useEffect(() => {
		if (!isPro || hasRestriction || !reminders.isPostRunOn || !lastRun) return;
		const { run, hydration } = lastRun;
		const endedAt = new Date(run.startedAt).getTime() + run.seconds * 1000;
		if (notified.includes(run.id) || Date.now() - endedAt > POST_RUN_WINDOW_MS) return;
		markRunNotified(run.id);
		schedulePostRunReminder(run.id, formatMl(hydration.replaceMl)).catch(ignore);
	}, [isPro, hasRestriction, reminders.isPostRunOn, lastRun, notified, markRunNotified]);
};
