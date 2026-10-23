import React from "react";
import { Image, Pressable } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { ILayoutSize, usePressScale } from "../../hooks";
import { GlassSurface, GradientLayers } from "../../primitives";

import { createGlassCardStyles } from "./styles";
import { IGlassCardProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Card de vidro (raio 30, rim branco, sombra ardósia). Com foto, a imagem
// fica sob um scrim azul-marinho em vez da névoa de vidro.
export const GlassCard: React.FC<IGlassCardProps> = ({
	variant = "default",
	image,
	padding,
	radius,
	onPress,
	children,
	style,
	testID = "pace-glass-card",
}) => {
	const { theme } = useTheme();
	const { animatedStyle, onPressIn, onPressOut } = usePressScale(
		theme.pace.motion.press.card,
		!!onPress,
	);
	const styles = createGlassCardStyles(theme, {
		variant,
		padding: padding ?? theme.pace.spacing.cardPad,
	});
	const source = typeof image === "string" ? { uri: image } : image;
	const backdrop = source
		? (size: ILayoutSize) => (
				<>
					<Image source={source} style={styles.image} accessibilityIgnoresInvertColors />
					<GradientLayers
						layers={theme.pace.gradients.cardPhotoScrim}
						width={size.width}
						height={size.height}
					/>
				</>
			)
		: undefined;

	return (
		<AnimatedPressable
			testID={testID}
			disabled={!onPress}
			accessibilityRole={onPress ? "button" : undefined}
			onPress={onPress}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
			style={[animatedStyle, style]}
		>
			<GlassSurface
				appearance={styles.appearance}
				radius={radius ?? theme.pace.radii.xl}
				style={styles.surface}
				backdrop={backdrop}
			>
				{children}
			</GlassSurface>
		</AnimatedPressable>
	);
};

export * from "./types";
