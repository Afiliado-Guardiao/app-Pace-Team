import { useEffect, useMemo } from "react";

import { generateDaysForMonth, getMaxDaysInMonth, IMonthKey, MONTH_KEYS } from "../constants";
import { IParsedBirthDate, IUseBirthDatePickersProps, IWheelPickerConfig } from "../types";

export const useBirthDatePickers = ({
	step,
	value,
	onChange,
}: IUseBirthDatePickersProps): IWheelPickerConfig[] => {
	const parsedValue: IParsedBirthDate = useMemo(() => {
		try {
			if (value) {
				return JSON.parse(value) as IParsedBirthDate;
			}
			const targetYear = new Date().getFullYear() - 25;
			return {
				day: "01",
				month: "january",
				year: String(targetYear),
			};
		} catch {
			const targetYear = new Date().getFullYear() - 25;
			return {
				day: "01",
				month: "january",
				year: String(targetYear),
			};
		}
	}, [value]);

	const selectedMonth: IMonthKey = useMemo(() => {
		const monthValue = parsedValue.month;
		if (monthValue && MONTH_KEYS.includes(monthValue as IMonthKey)) {
			return monthValue as IMonthKey;
		}
		return "january";
	}, [parsedValue.month]);

	const daysData = useMemo(() => {
		return generateDaysForMonth(selectedMonth);
	}, [selectedMonth]);

	useEffect(() => {
		const currentDay = parsedValue.day;
		if (!currentDay) return;

		const maxDaysInMonth = getMaxDaysInMonth(selectedMonth);
		const dayNumber = parseInt(currentDay, 10);

		if (dayNumber > maxDaysInMonth) {
			const adjustedDay = maxDaysInMonth.toString().padStart(2, "0");
			const updated = {
				...parsedValue,
				day: adjustedDay,
			};
			onChange(JSON.stringify(updated));
		}
	}, [selectedMonth, parsedValue, onChange]);

	const modifiedPickers = useMemo(() => {
		return step.pickers.map((picker) => {
			if (picker.id === "day") {
				return {
					...picker,
					data: daysData,
				};
			}
			return picker;
		});
	}, [step.pickers, daysData]);

	return modifiedPickers;
};
