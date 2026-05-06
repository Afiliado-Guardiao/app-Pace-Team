import { type IMonthKey, MONTH_KEYS } from "@/components/shared/WheelPicker/constants";

export { type IMonthKey, MONTH_KEYS };

export const MIN_BIRTH_YEAR = 1940;
export const MAX_BIRTH_YEAR = 2015;

export const BIRTHDATE_DEFAULTS = {
	day: 1,
	month: 1,
	year: new Date().getFullYear() - 25,
};

export const getDaysInMonth = (month: number, year: number): number => {
	return new Date(year, month, 0).getDate();
};

export const getValidBirthYears = (): string[] => {
	return Array.from({ length: MAX_BIRTH_YEAR - MIN_BIRTH_YEAR + 1 }, (_, i) =>
		(MIN_BIRTH_YEAR + i).toString(),
	);
};

export const getMaxDaysInMonth = (monthKey: IMonthKey): number => {
	const daysInMonth: Record<IMonthKey, number> = {
		january: 31,
		february: 28,
		march: 31,
		april: 30,
		may: 31,
		june: 30,
		july: 31,
		august: 31,
		september: 30,
		october: 31,
		november: 30,
		december: 31,
	};

	return daysInMonth[monthKey];
};

export const generateDaysForMonth = (monthKey: IMonthKey): string[] => {
	const maxDays = getMaxDaysInMonth(monthKey);
	return Array.from({ length: maxDays }, (_, i) => (i + 1).toString().padStart(2, "0"));
};
