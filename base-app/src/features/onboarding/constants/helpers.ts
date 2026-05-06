import { BIRTHDATE_DEFAULTS, getDaysInMonth, getValidBirthYears, MONTH_KEYS } from "./birthDate";
import { BODY_METRICS_DEFAULTS } from "./bodyMetrics";

export const generateYearsList = (): string[] => {
	return getValidBirthYears();
};

export const getBirthDateDefaults = () => ({
	day: BIRTHDATE_DEFAULTS.day.toString().padStart(2, "0"),
	month: MONTH_KEYS[BIRTHDATE_DEFAULTS.month - 1],
	year: BIRTHDATE_DEFAULTS.year.toString(),
});

export const getBodyMetricsDefaults = () => ({
	height: BODY_METRICS_DEFAULTS.height.toString(),
	weight: BODY_METRICS_DEFAULTS.weight.toString(),
});

export { getDaysInMonth, MONTH_KEYS };
