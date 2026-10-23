import React from "react";
import { Pressable, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { usePressScale } from "../../hooks";
import { GlassSurface } from "../../primitives";
import { Icon } from "../Icon";

import { createIconButtonStyles } from "./styles";
import { IIconButtonProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DEFAULT_SIZE = 44;

// Botão circular com ícone dentro de vidro (anel branco). badge = ponto laranja.
export const IconButton: React.FC<IIconButtonProps> = ({
	icon,
	label,
	onPress,
	variant = "glass",
	size = DEFAULT_SIZE,
	badge = false,
	disabled = false,
	style,
	testID = "pace-icon-button",
}) => {
	const { theme } = useTheme();
	const { animatedStyle, onPressIn, onPressOut } = usePressScale(
		theme.pace.motion.press.iconButton,
		!disabled,
	);
	const styles = createIconButtonStyles(theme, { variant, size, disabled });

	return (
		<AnimatedPressable
			testID={testID}
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ disabled }}
			disabled={disabled}
			onPress={onPress}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
			style={[styles.pressable, animatedStyle, style]}
		>
			<GlassSurface appearance={styles.appearance} radius={size / 2} style={styles.surface}>
				<Icon name={icon} size={styles.iconSize} color={styles.iconColor} />
				{badge ? <View style={styles.badge} /> : null}
			</GlassSurface>
		</AnimatedPressable>
	);
};

export * from "./types";
