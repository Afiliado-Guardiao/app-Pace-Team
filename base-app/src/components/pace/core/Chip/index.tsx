import React from "react";
import { Pressable, Text } from "react-native";

import { useTheme } from "@/theme";

import { GlassSurface } from "../../primitives";
import { Icon } from "../Icon";

import { createChipStyles } from "./styles";
import { IChipProps } from "./types";

// Filtro pílula de vidro; selecionado = laranja sólido com brilho.
export const Chip: React.FC<IChipProps> = ({
	children,
	selected = false,
	icon,
	onPress,
	size = "md",
	style,
	testID = "pace-chip",
}) => {
	const { theme } = useTheme();
	const styles = createChipStyles(theme, size, selected);
	const label = typeof children === "string" ? children : undefined;

	return (
		<Pressable
			testID={testID}
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ selected }}
			onPress={onPress}
			style={[styles.pressable, style]}
		>
			<GlassSurface appearance={styles.appearance} radius={styles.radius} style={styles.surface}>
				{icon ? (
					<Icon name={icon} size={styles.iconSize} color={styles.text.color as string} />
				) : null}
				{typeof children === "string" ? <Text style={styles.text}>{children}</Text> : children}
			</GlassSurface>
		</Pressable>
	);
};

export * from "./types";
