import { useCallback, useMemo } from "react";

import * as Haptics from "expo-haptics";

import { useTranslation } from "react-i18next";

import type { ITheme } from "@/theme/types";

import { MONTH_KEYS } from "../constants";
import { IWheelPickerItem, IWheelPickerLibProps, IWheelPickerProps } from "../types";

const isMonthKey = (value: string | number): boolean => {
	return typeof value === "string" && MONTH_KEYS.includes(value as (typeof MONTH_KEYS)[number]);
};

interface IUseWheelPickerParams
	extends Pick<
		IWheelPickerProps,
		| "data"
		| "selectedValue"
		| "onValueChange"
		| "unit"
		| "translationNamespace"
		| "monthTranslationPath"
		| "enableHaptics"
	> {
	theme: ITheme;
	pickerWidth: number;
}

export const useWheelPicker = ({
	data,
	selectedValue,
	onValueChange,
	unit,
	theme,
	pickerWidth,
	translationNamespace,
	monthTranslationPath,
	enableHaptics = true,
}: IUseWheelPickerParams) => {
	const { t } = useTranslation(translationNamespace ?? "onboarding");

	const pickerData: IWheelPickerItem[] = useMemo(
		() =>
			data.map((item) => {
				if (isMonthKey(item)) {
					return {
						value: item,
						label: t(`${monthTranslationPath ?? "steps.birthDate.months"}.${String(item)}`),
					};
				}
				return {
					value: item,
					label: unit ? `${String(item)} ${unit}` : String(item),
				};
			}),
		[data, unit, t, monthTranslationPath],
	);

	const handleValueChange = useCallback(
		({ item }: { item: IWheelPickerItem }) => {
			if (item.value !== selectedValue) {
				onValueChange(item.value);
			}
		},
		[selectedValue, onValueChange],
	);

	const handleValueChanging = useCallback(() => {
		if (enableHaptics) {
			void Haptics.selectionAsync();
		}
	}, [enableHaptics]);

	const currentValue = useMemo(() => {
		const found = pickerData.find((item) => item.value === selectedValue);
		if (found) {
			return found.value;
		}
		return pickerData[0]?.value ?? null;
	}, [pickerData, selectedValue]);

	const isEmpty = pickerData.length === 0;

	const wheelPickerProps: IWheelPickerLibProps | null = useMemo(() => {
		if (isEmpty) return null;

		return {
			data: pickerData,
			value: currentValue || pickerData[0].value,
			onValueChanged: handleValueChange,
			...(enableHaptics && { onValueChanging: handleValueChanging }),
			itemHeight: 40,
			visibleItemCount: 5,
			height: 180,
			scrollEventThrottle: theme.spacing.sm,
			itemTextStyle: {
				fontSize: theme.typography.sizes.lg,
				color: theme.colors.text,
			},
			selectedItemTextStyle: {
				fontSize: theme.typography.sizes.lg,
				color: theme.colors.text,
				fontWeight: "600",
			},
			selectedItemContainerStyle: {
				backgroundColor: theme.colors.surface,
			},
			containerProps: {
				style: {
					width: pickerWidth,
					height: 180,
					backgroundColor: "transparent",
				},
			},
		};
	}, [
		isEmpty,
		pickerData,
		currentValue,
		handleValueChange,
		handleValueChanging,
		enableHaptics,
		theme,
		pickerWidth,
	]);

	return {
		pickerData,
		currentValue,
		handleValueChange,
		wheelPickerProps,
		isEmpty,
	};
};
