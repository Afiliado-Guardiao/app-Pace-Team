import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { useActionButton } from "../hooks";
import { createActionButtonStyles } from "../styles";
import { IActionButtonProps } from "../types";

export const ActionButton: React.FC<IActionButtonProps> = ({ text, onPress, disabled }) => {
	const { theme } = useTheme();
	const { handlePress } = useActionButton({ onPress, disabled });
	const styles = createActionButtonStyles(theme, disabled);

	return (
		<View style={styles.container}>
			<Pressable
				testID="btn-action"
				accessibilityLabel={text}
				style={styles.button}
				onPress={handlePress}
				disabled={disabled}
			>
				<Text style={styles.text}>{text}</Text>
			</Pressable>
		</View>
	);
};
