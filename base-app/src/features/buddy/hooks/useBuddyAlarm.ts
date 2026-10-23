import { ensureNotificationPermission } from "@/lib/buddy/notifications";
import { useBuddyStore } from "@/lib/buddy/store";

import { ALARM_MINUTE_STEP, WEEK_DAYS } from "../constants";

const pad = (n: number): string => String(n).padStart(2, "0");
const wrap = (v: number, size: number): number => ((v % size) + size) % size;

// Despertador de corrida: hora, dias e liga/desliga. O agendamento no iPhone
// (AlarmKit no iOS 26, notificação com som antes) é feito pelo useBuddySync.
export const useBuddyAlarm = () => {
	const alarm = useBuddyStore((s) => s.alarm);
	const setAlarm = useBuddyStore((s) => s.setAlarm);

	return {
		isOn: alarm.isOn,
		hour: pad(alarm.hour),
		minute: pad(alarm.minute),
		days: WEEK_DAYS.map((label, day) => ({
			day,
			label,
			isOn: alarm.days.includes(day),
		})),
		toggle: (isOn: boolean) => {
			setAlarm({ isOn });
			if (isOn) ensureNotificationPermission().catch(() => undefined);
		},
		shiftHour: (delta: number) => {
			setAlarm({ hour: wrap(alarm.hour + delta, 24) });
		},
		shiftMinute: (delta: number) => {
			setAlarm({ minute: wrap(alarm.minute + delta * ALARM_MINUTE_STEP, 60) });
		},
		toggleDay: (day: number) => {
			const days = alarm.days.includes(day)
				? alarm.days.filter((d) => d !== day)
				: [...alarm.days, day];
			setAlarm({ days: days.sort((a, b) => a - b) });
		},
	};
};
