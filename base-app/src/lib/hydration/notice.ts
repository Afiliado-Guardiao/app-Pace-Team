import { create } from "zustand";

// Tudo o que entrou na conta da reposição de uma corrida. Vai junto na
// notificação: tocar nela abre o pop-up com esses mesmos números.
export interface IHydroNotice {
	runId: string;
	startedAt: string;
	seconds: number;
	km: number;
	tempC: number | null;
	weightKg: number | null;
	rateLph: number;
	isPersonal: boolean;
	lossMl: number;
	replaceMl: number;
}

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

// Lê o que veio na notificação (null = aviso antigo, sem os números)
export const toHydroNotice = (raw: unknown): IHydroNotice | null => {
	if (typeof raw !== "object" || raw === null) return null;
	const d = raw as Partial<Record<keyof IHydroNotice, unknown>>;
	if (!isNumber(d.km) || !isNumber(d.seconds) || !isNumber(d.replaceMl)) return null;
	if (!isNumber(d.lossMl) || !isNumber(d.rateLph)) return null;
	return {
		runId: typeof d.runId === "string" ? d.runId : "",
		startedAt: typeof d.startedAt === "string" ? d.startedAt : "",
		seconds: d.seconds,
		km: d.km,
		tempC: isNumber(d.tempC) ? d.tempC : null,
		weightKg: isNumber(d.weightKg) ? d.weightKg : null,
		rateLph: d.rateLph,
		isPersonal: d.isPersonal === true,
		lossMl: d.lossMl,
		replaceMl: d.replaceMl,
	};
};

interface IHydroNoticeState {
	notice: IHydroNotice | null;
	open: (notice: IHydroNotice) => void;
	close: () => void;
}

// Pop-up da reposição aberto agora
export const useHydroNotice = create<IHydroNoticeState>()((set) => ({
	notice: null,
	open: (notice) => {
		set({ notice });
	},
	close: () => {
		set({ notice: null });
	},
}));
