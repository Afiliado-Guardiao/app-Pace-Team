import { IHydroLog } from "./store";

// Contas do dia (início do dia no fuso do aparelho)

export const startOfDay = (t: number): number => {
	const d = new Date(t);
	return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

export const isToday = (t: number, now: number): boolean => startOfDay(t) === startOfDay(now);

export const drankOn = (logs: readonly IHydroLog[], day: number): number =>
	logs.filter((l) => startOfDay(l.at) === day).reduce((sum, l) => sum + l.ml, 0);

export interface IHydroDay {
	day: number;
	ml: number;
}

// Últimos 7 dias (o mais antigo primeiro)
export const lastWeek = (logs: readonly IHydroLog[], now: number): IHydroDay[] => {
	const today = startOfDay(now);
	return [6, 5, 4, 3, 2, 1, 0].map((back) => {
		const day = startOfDay(today - back * 86_400_000 + 3_600_000);
		return { day, ml: drankOn(logs, day) };
	});
};

// "1,2 L" / "350 ml"
export const formatMl = (ml: number): string =>
	ml >= 1000 ? `${(ml / 1000).toFixed(1).replace(".", ",")} L` : `${String(Math.round(ml))} ml`;

// Bud com sede: pouca água para o horário (nunca de manhã cedo)
export const isThirstyNow = (o: { drankMl: number; targetMl: number; now: number }): boolean => {
	if (o.targetMl <= 0) return false;
	const hour = new Date(o.now).getHours();
	const share = o.drankMl / o.targetMl;
	if (hour >= 18) return share < 0.5;
	if (hour >= 13) return share < 0.3;
	if (hour >= 10) return share < 0.1;
	return false;
};
