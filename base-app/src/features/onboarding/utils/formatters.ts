const MONTH_TO_NUMBER: Record<string, string> = {
	january: "01",
	february: "02",
	march: "03",
	april: "04",
	may: "05",
	june: "06",
	july: "07",
	august: "08",
	september: "09",
	october: "10",
	november: "11",
	december: "12",
};

export const formatBirthdayForBackend = (value: string): string => {
	try {
		const parsed = JSON.parse(value) as { day?: string; month?: string; year?: string };
		const day = parsed.day?.padStart(2, "0") || "01";
		const monthNumber = parsed.month ? MONTH_TO_NUMBER[parsed.month] || "01" : "01";
		const year = parsed.year || "2000";

		return `${year}-${monthNumber}-${day}`;
	} catch {
		return "";
	}
};

export const formatMeasurementsForBackend = (
	value: string,
): { height: string; weight: string } | null => {
	try {
		const parsed = JSON.parse(value) as { height?: string | number; weight?: string | number };
		return {
			height: String(parsed.height || 170),
			weight: String(parsed.weight || 70),
		};
	} catch {
		return null;
	}
};

export const parseAnswerForBackend = (
	stepId: string,
	value: string | string[] | undefined,
): unknown => {
	if (value === undefined || value === "") {
		return undefined;
	}

	if (Array.isArray(value)) {
		return value;
	}

	if (stepId === "birthday") {
		return formatBirthdayForBackend(value);
	}

	if (stepId === "measurements") {
		return formatMeasurementsForBackend(value);
	}

	return value;
};
