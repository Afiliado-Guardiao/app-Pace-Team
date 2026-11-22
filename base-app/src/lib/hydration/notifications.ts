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

// Lembretes que se repetem sozinhos (todo dia, ou nos dias da semana
// escolhidos): ficam ligados até o atleta desligar, sem pausa nem prazo. O
// texto é refeito ao abrir o app e a cada copo registrado
export interface IReminderSpec {
	id: string;
	body: string;
	hour: number;
	minute: number;
	// null = todo dia; 1 (domingo) a 7 (sábado) = só nesse dia da semana
	weekday: number | null;
}

const leftText = (ml: number): string => `Falta você beber ${formatMl(ml)} de água hoje. Já bebeu?`;
// Meta de hoje já batida: o lembrete continua, com a meta do dia
const goalText = (ml: number): string =>
	`Sua meta de água é de cerca de ${formatMl(ml)} por dia. Já bebeu um copo agora?`;

const bodyFor = (amount: number | null, dayMl: number | null, i: number): string => {
	if (amount === null || dayMl === null) return MESSAGES[i % MESSAGES.length];
	return amount > 0 ? leftText(amount) : goalText(dayMl);
};

export const planHydrationReminders = (r: IHydroReminders, left: IHydroLeft): IReminderSpec[] => {
	const slots = slotsOf(r);
	const everyDay = r.days.length === 7;
	const today = new Date().getDay();
	const out: IReminderSpec[] = [];
	slots.forEach((slot, i) => {
		if (everyDay) {
			const body = bodyFor(left.todayMl, left.dayMl, i);
			out.push({ id: `${PREFIX}${String(i)}`, body, ...slot, weekday: null });
			return;
		}
		r.days.forEach((day) => {
			// Hoje: quanto falta; os outros dias da semana: a meta do dia inteira
			const amount = day === today ? left.todayMl : left.dayMl;
			const body = bodyFor(amount, left.dayMl, i);
			out.push({ id: `${PREFIX}${String(i)}-${String(day)}`, body, ...slot, weekday: day + 1 });
		});
	});
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
	if (!isPro || !r.isOn || r.days.length === 0) return;
	if (!(await ensureNotificationPermission())) return;
	await Promise.all(
		planHydrationReminders(r, left).map((p) =>
			Notifications.scheduleNotificationAsync({
				identifier: p.id,
				content: { title: HYDRATION_PUSH.title, body: p.body, sound: true },
				trigger:
					p.weekday === null
						? {
								type: Notifications.SchedulableTriggerInputTypes.DAILY,
								hour: p.hour,
								minute: p.minute,
							}
						: {
								type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
								weekday: p.weekday,
								hour: p.hour,
								minute: p.minute,
							},
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
