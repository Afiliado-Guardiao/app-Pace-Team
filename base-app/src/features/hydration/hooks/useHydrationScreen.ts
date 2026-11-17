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
import { IHydroSetup, useHydroSetup } from "./useHydroSetup";
import { ISweatForm, useSweatForm } from "./useSweatForm";

export interface IHydrationScreen {
	hydro: IUseHydrationReturn;
	reminders: IHydroReminders;
	toast: IFloatingToastData | null;
	amount: IAmountForm;
	// Seus dados em passos (abre sozinho na primeira vez)
	setup: IHydroSetup;
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
	const goBack = () => {
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.HOME);
	};
	const setup = useHydroSetup(goBack);
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
		setup,
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
		goBack,
	};
};

const nextMidnight = (): number => {
	const d = new Date(Date.now() + DAY_MS);
	return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};
