import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { GlassSurface } from "../../primitives";

import { createToastStyles } from "./styles";
import { IToastProps } from "./types";

const ICON_SIZE = 19;

// Aviso flutuante de vidro com ícone colorido pelo tom e ação opcional.
export const Toast: React.FC<IToastProps> = ({
	tone = "accent",
	icon,
	title,
	message,
	action,
	style,
	testID = "pace-toast",
}) => {
	const { theme } = useTheme();
	const styles = createToastStyles(theme, tone);

	return (
		<GlassSurface
			testID={testID}
			appearance={styles.appearance}
			radius={theme.pace.radii.row}
			style={[styles.surface, style]}
		>
			<View style={styles.iconDot} accessibilityElementsHidden>
				<Icon name={icon ?? styles.toneIcon} size={ICON_SIZE} color={styles.toneColor} />
			</View>
			<View style={styles.texts} accessibilityRole="alert">
				<Text style={styles.title}>{title}</Text>
				{message ? <Text style={styles.message}>{message}</Text> : null}
			</View>
			{action ? (
				<Pressable
					testID={`${testID}-action`}
					accessibilityRole="button"
					accessibilityLabel={action.label}
					onPress={action.onPress}
					style={styles.actionButton}
				>
					<Text style={styles.actionText}>{action.label}</Text>
				</Pressable>
			) : null}
		</GlassSurface>
	);
};

export * from "./types";
