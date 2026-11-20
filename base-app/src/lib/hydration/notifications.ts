import { Platform } from "react-native";

import * as Notifications from "expo-notifications";

import { ensureNotificationPermission } from "@/lib/buddy/notifications";

import { formatMl } from "./day";
import { IHydroReminders } from "./store";

// Lembretes do PACE HYDRATION: na janela do dia escolhida, nos dias
// escolhidos, nunca de madrugada, e o aviso de reposição depois da corrida.
const isIos = Platform.OS === "ios";
const PREFIX = "hydro-";
// O iOS guarda no máximo 64 avisos agendados (o Buddy também usa alguns)
const MAX_SLOTS = 36;
// Silêncio: nada antes das 7h nem depois das 22h
const QUIET_START = 22;
const QUIET_END = 7;

const MESSAGES = [
	"Hora de se hidratar! Seu Buddy está lembrando você.",
	"Que tal um copo d'água agora? O Bud agradece.",
	"Você está há um tempo sem registrar água. Bora um gole?",
] as const;

export const HYDRATION_PUSH = {
	title: "PACE HYDRATION",
	postRun: "Boa corrida! Não esqueça da reposição de líquidos, aos poucos.",
	preRun: "Sua corrida está chegando. Prepare sua hidratação!",
} as const;

const slotsOf = (r: IHydroReminders): { hour: number; minute: number }[] => {
	const start = Math.max(QUIET_END, r.startHour);
	const end = Math.min(QUIET_START, r.endHour);
	const out: { hour: number; minute: number }[] = [];
	for (let m = start * 60; m <= end * 60; m += Math.max(45, r.everyMin)) {
		out.push({ hour: Math.floor(m / 60), minute: m % 60 });
	}
	return out;
};

async function cancelHydrationReminders(): Promise<void> {
	const all = await Notifications.getAllScheduledNotificationsAsync();
	await Promise.all(
		all
			.filter((n) => n.identifier.startsWith(PREFIX) && !n.identifier.startsWith(`${PREFIX}run-`))
			.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
	);
}

// Quanto falta beber, para o texto do lembrete (null = sem meta: orientação
// médica, vai a mensagem comum)
export interface IHydroLeft {
	todayMl: number | null;
	// Dias seguintes: a estimativa base do dia (ainda sem nada bebido)
	dayMl: number | null;
}

// Os próximos dias de lembrete ficam agendados com data e hora; ao abrir o
// app (e a cada copo registrado) tudo é refeito com o quanto falta de verdade
const DAYS_AHEAD = 3;
const MIN_AHEAD_MS = 60_000;

const leftText = (ml: number): string => `Falta você beber ${formatMl(ml)} de água hoje. Já bebeu?`;

const bodyFor = (left: number | null, i: number): string =>
	left === null ? MESSAGES[i % MESSAGES.length] : leftText(left);

// Datas dos lembretes: hoje (o que falta agora) e os próximos dias (a meta
// do dia), só nos dias escolhidos e com hora ainda por vir
export const planHydrationReminders = (
	r: IHydroReminders,
	left: IHydroLeft,
): { at: Date; body: string; id: string }[] => {
	const slots = slotsOf(r);
	const now = Date.now();
	const out: { at: Date; body: string; id: string }[] = [];
	for (let d = 0; d < DAYS_AHEAD; d++) {
		const day = new Date(now);
		day.setDate(day.getDate() + d);
		const amount = d === 0 ? left.todayMl : left.dayMl;
		// Meta do dia batida: sem lembrete
		const isDone = amount !== null && amount <= 0;
		if (!r.days.includes(day.getDay()) || isDone) continue;
		slots.forEach((slot, i) => {
			const at = new Date(day);
			at.setHours(slot.hour, slot.minute, 0, 0);
			if (at.getTime() < now + MIN_AHEAD_MS) return;
			out.push({ at, body: bodyFor(amount, i), id: `${PREFIX}${String(d)}-${String(i)}` });
		});
	}
	return out.slice(0, MAX_SLOTS);
};

// Reagenda tudo (quando o atleta muda os lembretes, registra água ou abre o app)
export async function scheduleHydrationReminders(
	r: IHydroReminders,
	isPro: boolean,
	left: IHydroLeft,
): Promise<void> {
	if (!isIos) return;
	await cancelHydrationReminders();
	const isPaused = r.pausedUntil > Date.now();
	if (!isPro || !r.isOn || isPaused || r.days.length === 0) return;
	if (!(await ensureNotificationPermission())) return;
	await Promise.all(
		planHydrationReminders(r, left).map((p) =>
			Notifications.scheduleNotificationAsync({
				identifier: p.id,
				content: { title: HYDRATION_PUSH.title, body: p.body, sound: true },
				trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: p.at },
			}),
		),
	);
}

// Reposição: um aviso uns minutos depois que a corrida aparece no app
export async function schedulePostRunReminder(runId: string, liters: string): Promise<void> {
	if (!isIos) return;
	const hour = new Date().getHours();
	if (hour >= QUIET_START || hour < QUIET_END) return;
	if (!(await ensureNotificationPermission())) return;
	await Notifications.scheduleNotificationAsync({
		identifier: `${PREFIX}run-${runId}`,
		content: {
			title: HYDRATION_PUSH.title,
			body: `${HYDRATION_PUSH.postRun} Estimativa: cerca de ${liters} nas próximas horas.`,
			sound: true,
		},
		trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 10 * 60 },
	});
}
