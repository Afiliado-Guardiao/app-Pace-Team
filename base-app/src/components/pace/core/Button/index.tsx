import React from "react";
import { Pressable, Text } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { usePressScale } from "../../hooks";
import { GlassSurface } from "../../primitives";
import { Icon } from "../Icon";

import { ICON_STROKE } from "./constants";
import { createPaceButtonStyles } from "./styles";
import { IPaceButtonProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Botão pílula. primary = gradiente laranja radial com brilho; glass = vidro fosco.
export const Button: React.FC<IPaceButtonProps> = ({
	children,
	onPress,
	variant = "primary",
	size = "md",
	icon,
	iconRight,
	fullWidth = false,
	disabled = false,
	style,
	testID = "pace-button",
	accessibilityLabel,
}) => {
	const { theme } = useTheme();
	const { animatedStyle, onPressIn, onPressOut } = usePressScale(
		theme.pace.motion.press.button,
		!disabled,
	);
	const styles = createPaceButtonStyles(theme, { variant, size, disabled, fullWidth });
	const label = accessibilityLabel ?? (typeof children === "string" ? children : undefined);
	const iconColor = styles.text.color as string;

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
			<GlassSurface appearance={styles.appearance} radius={styles.radius} style={styles.surface}>
				{icon ? (
					<Icon name={icon} size={styles.iconSize} strokeWidth={ICON_STROKE} color={iconColor} />
				) : null}
				{typeof children === "string" ? <Text style={styles.text}>{children}</Text> : children}
				{iconRight ? (
					<Icon
						name={iconRight}
						size={styles.iconSize}
						strokeWidth={ICON_STROKE}
						color={iconColor}
					/>
				) : null}
			</GlassSurface>
		</AnimatedPressable>
	);
};

export * from "./types";
