import { useEffect, useRef } from "react";

import { saveBuddyProfile, saveBuddyStudio } from "@/lib/supabase";
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
	const hideCrown = useBuddyStore((s) => s.hideCrown);
	const studio = useBuddyStore((s) => s.studio);
	const isFirst = useRef(true);
	const isFirstStudio = useRef(true);

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
				hideCrown,
				alarmTime: alarm.isOn ? `${pad(alarm.hour)}:${pad(alarm.minute)}` : null,
				alarmDays: alarm.days,
			}).catch(() => undefined);
		}, SAVE_DELAY_MS);
		return () => {
			clearTimeout(id);
		};
	}, [color, lastFree, equipped, alarm, hideCrown]);

	// Escolha do Studio (a equipe vê no cartão do Buddy enquanto houver Pro)
	useEffect(() => {
		if (isFirstStudio.current) {
			isFirstStudio.current = false;
			return undefined;
		}
		if (IS_PREVIEW) return undefined;
		const items = [studio.head, studio.eyes, studio.back, studio.mouth].filter(
			(x): x is NonNullable<typeof x> => x !== null,
		);
		const id = setTimeout(() => {
			saveBuddyStudio({ color: studio.color, items }).catch(() => undefined);
		}, SAVE_DELAY_MS);
		return () => {
			clearTimeout(id);
		};
	}, [studio]);
};
