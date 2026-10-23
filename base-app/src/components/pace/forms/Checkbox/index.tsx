import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { useToggle } from "../../hooks";

import { createCheckboxStyles } from "./styles";
import { ICheckboxProps } from "./types";

const CHECK_SIZE = 14;
const CHECK_STROKE = 3;

// Caixa de seleção (aceite de termos etc.). Marcada = laranja com brilho.
export const Checkbox: React.FC<ICheckboxProps> = ({
	checked,
	defaultChecked,
	onChange,
	label,
	disabled = false,
	style,
	testID = "pace-checkbox",
	accessibilityLabel,
}) => {
	const { theme } = useTheme();
	const { isOn, toggle } = useToggle({ checked, defaultChecked, onChange, disabled });
	const styles = createCheckboxStyles(theme, { isOn, disabled });
	const a11yLabel = accessibilityLabel ?? (typeof label === "string" ? label : undefined);

	return (
		<Pressable
			testID={testID}
			accessibilityRole="checkbox"
			accessibilityLabel={a11yLabel}
			accessibilityState={{ checked: isOn, disabled }}
			onPress={toggle}
			disabled={disabled}
			style={[styles.root, style]}
		>
			<View style={styles.box}>
				{isOn ? (
					<Icon
						name="check"
						size={CHECK_SIZE}
						strokeWidth={CHECK_STROKE}
						color={theme.pace.colors.ink.white}
					/>
				) : null}
			</View>
			{label ? <Text style={styles.label}>{label}</Text> : null}
		</Pressable>
	);
};

export * from "./types";
