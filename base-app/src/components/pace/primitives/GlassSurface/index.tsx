import React from "react";
import { StyleSheet, View } from "react-native";

import { BlurView } from "expo-blur";

import { useTheme } from "@/theme";

import { useLayoutSize } from "../../hooks";
import { GlassRim } from "../GlassRim";
import { GradientLayers } from "../GradientLayers";

import { createGlassSurfaceStyles } from "./styles";
import { IGlassSurfaceProps } from "./types";

// Superfície de vidro do PACE TEAM: backdrop-filter + --glass-fill + borda
// hairline + brilho interno + rim branco, como a classe .pt-glass/.pt-rim.
export const GlassSurface: React.FC<IGlassSurfaceProps> = ({
	appearance,
	radius,
	style,
	backdrop,
	children,
	testID,
}) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const styles = createGlassSurfaceStyles(theme, appearance, radius);
	const gradient =
		typeof appearance.fill === "string" ? theme.pace.gradients[appearance.fill] : null;
	const blur = appearance.blur ?? 0;

	return (
		<View testID={testID} style={[styles.root, style]} onLayout={onLayout}>
			<View style={styles.clip} pointerEvents="none">
				{blur > 0 ? (
					<BlurView tint={theme.pace.blur.tint} intensity={blur} style={StyleSheet.absoluteFill} />
				) : null}
				<View style={styles.solid} />
				{gradient && size ? (
					<GradientLayers layers={gradient} width={size.width} height={size.height} />
				) : null}
				{backdrop && size ? backdrop(size) : null}
			</View>
			<View style={styles.overlay} pointerEvents="none" />
			{children}
			{appearance.rim && size ? (
				<GlassRim
					width={size.width - styles.borderWidth * 2}
					height={size.height - styles.borderWidth * 2}
					radius={radius}
					bottomRadius={styles.bottomRadius}
				/>
			) : null}
		</View>
	);
};

export * from "./types";
