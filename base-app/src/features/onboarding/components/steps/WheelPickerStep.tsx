import React from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";

import { WheelPicker } from "@/components/shared";
import { useTheme } from "@/theme";

import { useBirthDatePickers } from "../../hooks/useBirthDatePickers";
import { useWheelPickerStep } from "../../hooks/useWheelPickerStep";
import {
	createPickersRowStyles,
	createPickerWrapperStyles,
	createStepSubtitleSmallStyles,
	createStepTitleLargeStyles,
	createWheelPickerStepContainerStyles,
} from "../../styles";
import { IWheelPickerStepProps } from "../../types";
import { AnimatedContent } from "../AnimatedContent";

export const WheelPickerStep: React.FC<IWheelPickerStepProps> = ({ step, value, onChange }) => {
	const { theme } = useTheme();
	const { t } = useTranslation("onboarding");
	const { handlePickerChange, getPickerValue } = useWheelPickerStep({
		step,
		value,
		onChange,
	});

	const isBirthDateStep = step.id === "birthday";
	const birthDatePickers = useBirthDatePickers({ step, value, onChange });

	const pickersToRender = isBirthDateStep ? birthDatePickers : step.pickers;

	const titleStyles = createStepTitleLargeStyles(theme);
	const subtitleStyles = createStepSubtitleSmallStyles(theme);
	const pickersRowStyles = createPickersRowStyles(theme);
	const pickerWrapperStyles = createPickerWrapperStyles();
	const containerStyles = createWheelPickerStepContainerStyles(theme);

	return (
		<View style={containerStyles}>
			<AnimatedContent triggerKey={step.id}>
				{step.titleKey && <Text style={titleStyles}>{t(step.titleKey)}</Text>}
				{step.subtitleKey && <Text style={subtitleStyles}>{t(step.subtitleKey)}</Text>}
			</AnimatedContent>

			<View style={pickersRowStyles}>
				{pickersToRender.map((pickerConfig) => {
					const currentValue = getPickerValue(pickerConfig.id, pickerConfig.data[0] ?? "");

					return (
						<View
							key={pickerConfig.id}
							style={[pickerWrapperStyles, { maxWidth: pickerConfig.width }]}
						>
							<WheelPicker
								data={pickerConfig.data}
								selectedValue={currentValue}
								onValueChange={(newValue) => {
									handlePickerChange(pickerConfig.id, newValue);
								}}
								label={t(pickerConfig.labelKey)}
								unit={pickerConfig.unit}
								pickerWidth={pickerConfig.width}
								translationNamespace={pickerConfig.translationNamespace}
								monthTranslationPath={pickerConfig.monthTranslationPath}
							/>
						</View>
					);
				})}
			</View>
		</View>
	);
};
