import { useEffect, useRef } from "react";

import { saveBuddyProfile } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { useBuddyStore } from "./store";

const SAVE_DELAY_MS = 1500;
const pad = (n: number): string => String(n).padStart(2, "0");

// Cor, acessórios e despertador vão para o servidor (valem em qualquer
// aparelho). Espera 1,5 s parado para não salvar a cada toque.
export const useBuddyProfileSync = (): void => {
	const color = useBuddyStore((s) => s.color);
	const lastFree = useBuddyStore((s) => s.lastFree);
	const equipped = useBuddyStore((s) => s.equipped);
	const alarm = useBuddyStore((s) => s.alarm);
	const isFirst = useRef(true);

	useEffect(() => {
		// Não regrava o que acabou de carregar
		if (isFirst.current) {
			isFirst.current = false;
			return undefined;
		}
		if (IS_PREVIEW) return undefined;
		const id = setTimeout(() => {
			saveBuddyProfile({
				color,
				lastFree,
				equipped,
				alarmTime: alarm.isOn ? `${pad(alarm.hour)}:${pad(alarm.minute)}` : null,
				alarmDays: alarm.days,
			}).catch(() => undefined);
		}, SAVE_DELAY_MS);
		return () => {
			clearTimeout(id);
		};
	}, [color, lastFree, equipped, alarm]);
};
