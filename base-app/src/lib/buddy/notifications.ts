import { Platform } from "react-native";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import { registerBuddyDevice } from "@/lib/supabase";

import { buddyNative } from "./native";
import { IBuddyAlarm } from "./store";

// Avisos do Pace Buddy fora do app: doente depois de 7 dias sem correr,
// despertador de corrida (iOS 17–18; no iOS 26 é o AlarmKit) e o token de
// push para o aviso "fulano está online".
const SICK_ID = "buddy-sick";
const alarmId = (day: number): string => `buddy-alarm-${String(day)}`;
const isIos = Platform.OS === "ios";

export async function ensureNotificationPermission(): Promise<boolean> {
	if (!isIos) return false;
	const current = await Notifications.getPermissionsAsync();
	if (current.granted) return true;
	if (!current.canAskAgain) return false;
	const asked = await Notifications.requestPermissionsAsync();
	return asked.granted;
}

export async function scheduleSickReminder(sickAt: number | null): Promise<void> {
	if (!isIos) return;
	await Notifications.cancelScheduledNotificationAsync(SICK_ID);
	if (sickAt === null || sickAt <= Date.now()) return;
	await Notifications.scheduleNotificationAsync({
		identifier: SICK_ID,
		content: {
			title: "Tô com febre…",
			body: "Faz 7 dias sem correr. Um trote leve já me cura. Dois toques atrás do celular e bora!",
			sound: true,
		},
		trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(sickAt) },
	});
}

export async function scheduleBuddyAlarm(alarm: IBuddyAlarm): Promise<void> {
	if (!isIos) return;
	await Promise.all(
		[0, 1, 2, 3, 4, 5, 6].map((d) => Notifications.cancelScheduledNotificationAsync(alarmId(d))),
	);
	const isActive = alarm.isOn && alarm.days.length > 0;
	// iOS 26: alarme de verdade, com o botão "Correr agora"
	if (buddyNative.isAlarmKitAvailable()) {
		if (isActive) buddyNative.scheduleAlarm(JSON.stringify(alarm));
		else buddyNative.cancelAlarm();
		return;
	}
	if (!isActive || !(await ensureNotificationPermission())) return;
	await Promise.all(
		alarm.days.map((day) =>
			Notifications.scheduleNotificationAsync({
				identifier: alarmId(day),
				content: {
					title: "Hora de correr!",
					body: "O Buddy tá te esperando. Dois toques atrás do celular e bora.",
					sound: true,
					interruptionLevel: "timeSensitive",
				},
				trigger: {
					type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
					// expo-notifications: 1 = domingo
					weekday: day + 1,
					hour: alarm.hour,
					minute: alarm.minute,
				},
			}),
		),
	);
}

// Token de push (precisa do projeto no EAS: extra.eas.projectId no app.json)
export async function registerPushToken(): Promise<void> {
	const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
	const projectId = extra?.eas?.projectId;
	if (!isIos || !projectId || !(await ensureNotificationPermission())) return;
	const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
	await registerBuddyDevice(data);
}
