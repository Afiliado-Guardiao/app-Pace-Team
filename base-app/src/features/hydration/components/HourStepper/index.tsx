import React from "react";
import { Text, View } from "react-native";

import { IconButton } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IHourStepperProps {
	label: string;
	hour: number;
	min: number;
	max: number;
	onChange: (hour: number) => void;
	testID: string;
}

const BUTTON = 36;

const createHourStepperStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
		},
		label: {
			flex: 1,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		value: {
			minWidth: 44,
			textAlign: "center" as const,
			fontFamily: typography.numericFonts.semibold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
	};
};

// Horário do lembrete: − e + mudam uma hora por toque, quantas vezes quiser,
// dentro dos limites (nunca antes das 7h nem depois das 22h; início antes do fim)
export const HourStepper: React.FC<IHourStepperProps> = ({
	label,
	hour,
	min,
	max,
	onChange,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createHourStepperStyles(theme);

	return (
		<View style={styles.row} testID={testID}>
			<Text style={styles.label}>{label}</Text>
			<IconButton
				icon="minus"
				label={`${label}: uma hora antes`}
				size={BUTTON}
				disabled={hour <= min}
				onPress={() => {
					onChange(Math.max(min, hour - 1));
				}}
				testID={`${testID}-minus`}
			/>
			<Text style={styles.value}>{`${String(hour)}h`}</Text>
			<IconButton
				icon="plus"
				label={`${label}: uma hora depois`}
				size={BUTTON}
				disabled={hour >= max}
				onPress={() => {
					onChange(Math.min(max, hour + 1));
				}}
				testID={`${testID}-plus`}
			/>
		</View>
	);
};
