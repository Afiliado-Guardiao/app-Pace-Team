import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { GradientLayers, useLayoutSize } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { useSpringWidth } from "./useSpringWidth";

export { useSpringWidth } from "./useSpringWidth";

interface ISpringBarProps {
	// Fração preenchida (0–1)
	progress: number;
	height: number;
	delay?: number;
	// "progress" = laranja → quase branco; "soft" = branco translúcido
	tone?: "progress" | "soft";
	trackColor?: string;
}

const createSpringBarStyles = (
	theme: ITheme,
	options: { height: number; trackColor?: string },
) => ({
	track: {
		height: options.height,
		borderRadius: options.height / 2,
		overflow: "hidden" as const,
		backgroundColor: options.trackColor ?? theme.pace.colors.barEmpty,
	},
	fill: { height: "100%" as const, borderRadius: options.height / 2, overflow: "hidden" as const },
	soft: { flex: 1, backgroundColor: theme.pace.colors.barSoftFill },
});

// Barra que enche com a mola do design system (parciais, integrantes).
export const SpringBar: React.FC<ISpringBarProps> = ({
	progress,
	height,
	delay = 0,
	tone = "progress",
	trackColor,
}) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const widthStyle = useSpringWidth(progress, delay);
	const styles = createSpringBarStyles(theme, { height, trackColor });
	const isSoft = tone === "soft";

	return (
		<View style={styles.track} onLayout={onLayout}>
			<Animated.View style={[styles.fill, widthStyle]}>
				{isSoft ? <View style={styles.soft} /> : null}
				{!isSoft && size ? (
					<GradientLayers
						layers={theme.pace.gradients.progress}
						width={size.width * progress}
						height={height}
					/>
				) : null}
			</Animated.View>
		</View>
	);
};
