import React from "react";
import { Text, View } from "react-native";

import WheelPickerLib from "@quidone/react-native-wheel-picker";

import { useTheme } from "@/theme";

import { useWheelPicker } from "./hooks";
import { createWheelPickerStyles } from "./styles";
import { IWheelPickerLibProps, IWheelPickerProps } from "./types";

export const WheelPicker: React.FC<IWheelPickerProps> = ({
	data,
	selectedValue,
	onValueChange,
	label,
	unit,
	pickerWidth = 130,
	translationNamespace,
	monthTranslationPath,
	enableHaptics = true,
}) => {
	const { theme } = useTheme();
	const { wheelPickerProps, isEmpty } = useWheelPicker({
		data,
		selectedValue,
		onValueChange,
		unit,
		theme,
		pickerWidth,
		translationNamespace,
		monthTranslationPath,
		enableHaptics,
	});

	const styles = createWheelPickerStyles(theme, pickerWidth);

	if (isEmpty) {
		return null;
	}

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View style={styles.pickerWrapper}>
				<WheelPickerLib {...(wheelPickerProps as IWheelPickerLibProps)} />
			</View>
		</View>
	);
};

export * from "./types";
