import { useCallback, useEffect, useMemo, useRef } from "react";

import { getBirthDateDefaults, getBodyMetricsDefaults } from "../constants/helpers";
import { IWheelPickerStep } from "../types";

interface IUseWheelPickerStepProps {
	step: IWheelPickerStep;
	value: string;
	onChange: (value: string) => void;
}

interface IPickerValue {
	[key: string]: string;
}

interface IUseWheelPickerStepReturn {
	pickerValues: IPickerValue;
	handlePickerChange: (pickerId: string, value: string | number) => void;
	getPickerValue: (pickerId: string, defaultValue?: string | number) => string | number;
}

export const useWheelPickerStep = ({
	step,
	value,
	onChange,
}: IUseWheelPickerStepProps): IUseWheelPickerStepReturn => {
	const pickerValues = useMemo<IPickerValue>(() => {
		const normalizeValues = (values: IPickerValue): IPickerValue => {
			if (step.id === "measurements") {
				return {
					height: String((values.height as string | number) || 170),
					weight: String((values.weight as string | number) || 70),
				};
			}
			return values;
		};

		if (value) {
			try {
				let parsed: IPickerValue;
				if (typeof value === "string") {
					parsed = JSON.parse(value) as IPickerValue;
				} else {
					parsed = value as IPickerValue;
				}
				return normalizeValues(parsed);
			} catch {
				if (step.id === "birthday") {
					return getBirthDateDefaults() as IPickerValue;
				}
				if (step.id === "measurements") {
					return getBodyMetricsDefaults() as IPickerValue;
				}
				return {};
			}
		}

		if (step.id === "birthday") {
			return getBirthDateDefaults() as IPickerValue;
		}
		if (step.id === "measurements") {
			return getBodyMetricsDefaults() as IPickerValue;
		}
		return {};
	}, [value, step.id]);

	const hasInitializedRef = useRef<Record<string, boolean>>({});

	useEffect(() => {
		if (hasInitializedRef.current[step.id]) return;

		if (!value || value === "") {
			let defaultValues: IPickerValue | null = null;

			if (step.id === "birthday") {
				defaultValues = getBirthDateDefaults() as IPickerValue;
			} else if (step.id === "measurements") {
				defaultValues = getBodyMetricsDefaults() as IPickerValue;
			}

			if (defaultValues) {
				if (step.id === "measurements") {
					onChange(
						JSON.stringify({
							height: Number(defaultValues.height),
							weight: Number(defaultValues.weight),
						}),
					);
				} else {
					onChange(JSON.stringify(defaultValues));
				}
				hasInitializedRef.current[step.id] = true;
			}
		}
	}, [step.id, value, onChange]);

	const handlePickerChange = useCallback(
		(pickerId: string, pickerValue: string | number) => {
			let currentValues: IPickerValue = {};

			if (step.id === "measurements") {
				currentValues = typeof value === "object" ? (value as IPickerValue) : {};
			} else {
				currentValues = value ? (JSON.parse(value) as IPickerValue) : {};
			}

			const newValues = { ...currentValues, [pickerId]: String(pickerValue) };

			if (step.id === "measurements") {
				onChange(
					JSON.stringify({
						height: Number(newValues.height),
						weight: Number(newValues.weight),
					}),
				);
			} else {
				const serialized = JSON.stringify(newValues);
				onChange(serialized);
			}
		},
		[value, onChange, step.id],
	);

	const getPickerValue = useCallback(
		(pickerId: string, defaultValue?: string | number): string | number => {
			if (pickerId in pickerValues && pickerValues[pickerId]) {
				return pickerValues[pickerId];
			}
			return defaultValue ?? "";
		},
		[pickerValues],
	);

	return {
		pickerValues,
		handlePickerChange,
		getPickerValue,
	};
};
