import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { useTheme } from "@/theme";

import { createButtonStyles } from "./styles";
import { IButtonProps } from "./types";

export const Button: React.FC<IButtonProps> = ({
	children,
	onPress,
	variant = "default",
	size = "md",
	disabled = false,
	loading = false,
	style,
	textStyle,
	testID,
	accessibilityLabel,
}) => {
	const { theme } = useTheme();
	const styles = createButtonStyles(theme, variant, size, disabled || loading);

	return (
		<Pressable
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			onPress={onPress}
			disabled={disabled || loading}
			style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }, style]}
		>
			{loading ? (
				<ActivityIndicator color={styles.text.color} />
			) : (
				<Text style={[styles.text, textStyle]}>{children}</Text>
			)}
		</Pressable>
	);
};

export * from "./types";
