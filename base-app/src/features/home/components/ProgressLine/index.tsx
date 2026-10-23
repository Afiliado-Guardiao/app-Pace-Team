import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { GradientLayers, useLayoutSize } from "@/components/pace";
import { useSpringWidth } from "@/components/shared/SpringBar";
import { ITheme, useTheme } from "@/theme";

interface IProgressLineProps {
	progress: number;
	isDone: boolean;
	height: number;
	delay?: number;
}

const createProgressLineStyles = (theme: ITheme, height: number) => ({
	track: {
		height,
		borderRadius: height / 2,
		overflow: "hidden" as const,
		backgroundColor: theme.pace.colors.surfaceTabIdle,
	},
	fill: { height: "100%" as const, borderRadius: height / 2, overflow: "hidden" as const },
});

// Barra fina da disputa: laranja → branco, ou verde na virada concluída.
export const ProgressLine: React.FC<IProgressLineProps> = ({
	progress,
	isDone,
	height,
	delay = 200,
}) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const widthStyle = useSpringWidth(progress, delay);
	const styles = createProgressLineStyles(theme, height);
	const layers = isDone ? theme.pace.gradients.successProgress : theme.pace.gradients.progress;

	return (
		<View style={styles.track} onLayout={onLayout}>
			<Animated.View style={[styles.fill, widthStyle]}>
				{size ? (
					<GradientLayers layers={layers} width={size.width * progress} height={height} />
				) : null}
			</Animated.View>
		</View>
	);
};
