import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { useGoalField } from "../../hooks/useGoalField";

interface IGoalFieldProps {
	label: string;
	unit: string;
	value: string;
	display: string;
	onStep: (direction: number) => void;
	onType: (text: string) => void;
}

const STEP_BUTTON = 30;
const VALUE_SIZE = 19;

const createGoalFieldStyles = (theme: ITheme) => {
	const { blur, borders, colors, spacing, typography } = theme.pace;
	return {
		field: { flex: 1, minWidth: 0 },
		box: {
			paddingTop: 10,
			paddingBottom: 9,
			paddingHorizontal: spacing[1.5],
			alignItems: "center" as const,
			gap: 7,
		},
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		value: {
			fontFamily: typography.fonts.bold,
			fontSize: VALUE_SIZE,
			fontVariant: [...typography.tabularNums],
			color: colors.ink.white,
		},
		unit: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
		input: {
			width: "100%" as const,
			textAlign: "center" as const,
			padding: 0,
			paddingBottom: 2,
			borderBottomWidth: borders.hairline,
			borderBottomColor: colors.orange[500],
			fontFamily: typography.fonts.bold,
			fontSize: VALUE_SIZE,
			color: colors.ink.white,
		},
		buttons: { flexDirection: "row" as const, gap: spacing[2] },
		stepButton: {
			width: STEP_BUTTON,
			height: STEP_BUTTON,
			borderRadius: STEP_BUTTON / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			borderWidth: borders.hairline,
			borderColor: colors.feedBorder,
			backgroundColor: colors.glass1,
		},
	};
};

// Um valor da meta em vidro: − / número / +. Tocar no número abre o teclado.
export const GoalField: React.FC<IGoalFieldProps> = ({
	label,
	unit,
	value,
	display,
	onStep,
	onType,
}) => {
	const { theme } = useTheme();
	const styles = createGoalFieldStyles(theme);
	const field = useGoalField(onStep, onType);

	return (
		<GlassSurface
			appearance={styles.appearance}
			radius={theme.pace.radii.rowSm}
			style={[styles.field, styles.box]}
		>
			<Text style={styles.label}>{label}</Text>
			{field.isEditing ? (
				<TextInput
					autoFocus
					keyboardType="numbers-and-punctuation"
					value={field.text}
					onChangeText={field.setText}
					onBlur={field.commit}
					onSubmitEditing={field.commit}
					style={styles.input}
					accessibilityLabel={`Editar ${label}`}
				/>
			) : (
				<Pressable
					onPress={() => {
						field.beginEdit(value);
					}}
					accessibilityRole="button"
					accessibilityLabel={`Editar ${label}`}
				>
					<Text style={styles.value}>
						{display}
						<Text style={styles.unit}> {unit}</Text>
					</Text>
				</Pressable>
			)}
			<View style={styles.buttons}>
				<Pressable
					style={styles.stepButton}
					onPressIn={() => {
						field.startHold(-1);
					}}
					onPressOut={field.stopHold}
					accessibilityRole="button"
					accessibilityLabel={`Diminuir ${label}`}
				>
					<Icon name="minus" size={14} />
				</Pressable>
				<Pressable
					style={styles.stepButton}
					onPressIn={() => {
						field.startHold(1);
					}}
					onPressOut={field.stopHold}
					accessibilityRole="button"
					accessibilityLabel={`Aumentar ${label}`}
				>
					<Icon name="plus" size={14} />
				</Pressable>
			</View>
		</GlassSurface>
	);
};
