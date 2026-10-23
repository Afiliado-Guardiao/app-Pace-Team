import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { createRadioStyles } from "./styles";
import { IRadioProps } from "./types";

// Opção única: círculo de vidro; marcado = ponto laranja com brilho.
export const Radio: React.FC<IRadioProps> = ({
	checked = false,
	onChange,
	label,
	description,
	disabled = false,
	style,
	testID = "pace-radio",
}) => {
	const { theme } = useTheme();
	const styles = createRadioStyles(theme, { checked, disabled });
	const handlePress = (): void => {
		onChange?.(true);
	};

	return (
		<Pressable
			testID={testID}
			accessibilityRole="radio"
			accessibilityLabel={label}
			accessibilityState={{ checked, disabled }}
			onPress={handlePress}
			disabled={disabled}
			style={[styles.root, style]}
		>
			<View style={styles.circle}>{checked ? <View style={styles.dot} /> : null}</View>
			<View style={styles.texts}>
				{label ? <Text style={styles.label}>{label}</Text> : null}
				{description ? <Text style={styles.description}>{description}</Text> : null}
			</View>
		</Pressable>
	);
};

export * from "./types";
