import { useEffect } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useMyPro } from "@/lib/data";
import {
	formatMl,
	IHydroKind,
	IHydroReminders,
	IUseHydrationReturn,
	useHydration,
	useHydrationStore,
} from "@/lib/hydration";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { HYDRO_COPY } from "../constants";

import { IAmountForm, useAmountForm } from "./useAmountForm";
import { IBodyForm, useBodyForm } from "./useBodyForm";
import { ISweatForm, useSweatForm } from "./useSweatForm";

export interface IHydrationScreen {
	hydro: IUseHydrationReturn;
	reminders: IHydroReminders;
	toast: IFloatingToastData | null;
	amount: IAmountForm;
	body: IBodyForm;
	sweat: ISweatForm;
	add: (ml: number, kind?: IHydroKind) => void;
	remove: (id: string) => void;
	setReminders: (r: Partial<IHydroReminders>) => void;
	goBack: () => void;
}

const DAY_MS = 86_400_000;

// PACE HYDRATION (Team Pro): estimativa do dia, registro, corrida, suor e
// lembretes. Sem Pro, a apresentação do recurso explica o que ele faz.
export const useHydrationScreen = (): IHydrationScreen => {
	const router = useRouter();
	const { isPro, isLoading } = useMyPro();
	const hydro = useHydration();
	const st = useHydrationStore();
	const { toast, showToast } = useFloatingToast();
	const saved = (ml?: number) => {
		showToast({
			tone: "success",
			title: HYDRO_COPY.saved,
			message: ml ? `+${formatMl(ml)}` : undefined,
		});
	};
	const amount = useAmountForm(() => {
		saved();
	});

	useEffect(() => {
		if (!IS_PREVIEW && !isLoading && !isPro) {
			router.replace({ pathname: ROUTES.PRO_FEATURE, params: { id: "hydration" } });
		}
	}, [isPro, isLoading, router]);

	return {
		hydro,
		reminders: st.reminders,
		toast,
		amount,
		body: useBodyForm(),
		sweat: useSweatForm(),
		add: (ml, kind = "day") => {
			st.addLog(ml, kind);
			saved(ml);
		},
		remove: st.removeLog,
		setReminders: (r) => {
			// "Pausar hoje" vale até a meia-noite
			const next = r.pausedUntil === 1 ? { ...r, pausedUntil: nextMidnight() } : r;
			st.setReminders(next);
		},
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
	};
};

const nextMidnight = (): number => {
	const d = new Date(Date.now() + DAY_MS);
	return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};
