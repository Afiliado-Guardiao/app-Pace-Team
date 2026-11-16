import { Platform } from "react-native";

import * as Notifications from "expo-notifications";

import { ensureNotificationPermission } from "@/lib/buddy/notifications";

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

// Reagenda tudo (chamado quando o atleta muda os lembretes)
export async function scheduleHydrationReminders(
	r: IHydroReminders,
	isPro: boolean,
): Promise<void> {
	if (!isIos) return;
	await cancelHydrationReminders();
	const isPaused = r.pausedUntil > Date.now();
	if (!isPro || !r.isOn || isPaused || r.days.length === 0) return;
	if (!(await ensureNotificationPermission())) return;
	const slots = slotsOf(r);
	const everyDay = r.days.length === 7;
	const jobs: Promise<string>[] = [];
	slots.forEach((slot, i) => {
		const content = {
			title: HYDRATION_PUSH.title,
			body: MESSAGES[i % MESSAGES.length],
			sound: true,
		};
		if (everyDay) {
			jobs.push(
				Notifications.scheduleNotificationAsync({
					identifier: `${PREFIX}${String(i)}`,
					content,
					trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, ...slot },
				}),
			);
			return;
		}
		r.days.forEach((day) => {
			jobs.push(
				Notifications.scheduleNotificationAsync({
					identifier: `${PREFIX}${String(i)}-${String(day)}`,
					content,
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
						weekday: day + 1,
						...slot,
					},
				}),
			);
		});
	});
	await Promise.all(jobs.slice(0, MAX_SLOTS));
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
