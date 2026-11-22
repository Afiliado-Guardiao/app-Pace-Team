import { useCallback } from "react";

import { useRouter } from "expo-router";

import { IHydroNotice, useHydrationStore, useHydroNotice } from "@/lib/hydration";
import { ROUTES } from "@/constants/routes";

// Um copo grande por vez: a reposição é aos poucos
const LOG_MAX = 500;

interface IUseHydroNoticeSheetReturn {
	notice: IHydroNotice | null;
	logMl: number;
	log: () => void;
	openScreen: () => void;
	close: () => void;
}

// Pop-up da água depois da corrida (tocou na notificação)
export const useHydroNoticeSheet = (): IUseHydroNoticeSheetReturn => {
	const router = useRouter();
	const notice = useHydroNotice((s) => s.notice);
	const close = useHydroNotice((s) => s.close);
	const addLog = useHydrationStore((s) => s.addLog);
	const logMl = Math.min(LOG_MAX, notice?.replaceMl ?? 0);

	return {
		notice,
		logMl,
		log: useCallback(() => {
			addLog(logMl, "post");
			close();
		}, [addLog, logMl, close]),
		openScreen: useCallback(() => {
			close();
			router.push(ROUTES.HYDRATION);
		}, [close, router]),
		close,
	};
};
