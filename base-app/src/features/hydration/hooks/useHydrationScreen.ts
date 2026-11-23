import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import {
	formatMl,
	IHydroKind,
	IHydroReminders,
	IUseHydrationReturn,
	useHydration,
	useHydrationStore,
} from "@/lib/hydration";
import { useProGate } from "@/lib/pro";
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

// PACE HYDRATION (Team Pro): estimativa do dia, registro, corrida, suor e
// lembretes. Sem o Pro a tela é uma vitrine: usar abre a janela do Team Pro.
export const useHydrationScreen = (): IHydrationScreen => {
	const router = useRouter();
	const gate = useProGate("hydration");
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
		gate.leave();
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.HOME);
	};
	const setup = useHydroSetup(goBack, gate.isPro);
	// Sem o Pro, cada ação abre a janela do Team Pro em vez de agir
	const guard =
		<A extends unknown[]>(fn: (...args: A) => void) =>
		(...args: A) => {
			if (gate.isPro) fn(...args);
			else gate.ask();
		};
	const sweat = useSweatForm();
	const amount = useAmountForm(() => {
		saved();
	});

	return {
		hydro,
		reminders: st.reminders,
		toast,
		amount: { ...amount, open: guard(amount.open) },
		setup: { ...setup, open: guard(setup.open) },
		sweat: { ...sweat, open: guard(sweat.open) },
		add: guard((ml: number, kind: IHydroKind = "day") => {
			st.addLog(ml, kind);
			saved(ml);
		}),
		remove: guard(st.removeLog),
		setReminders: guard(st.setReminders),
		goBack,
	};
};
