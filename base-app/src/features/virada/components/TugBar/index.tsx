import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { GradientLayers, Icon, useLayoutSize } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { useViradaFill } from "../../hooks/useViradaFill";

interface ITugBarProps {
	progress: number;
	isDone: boolean;
}

const HEIGHT = 12;
const KNOB = 26;
const KNOB_ICON = 13;
const KNOB_STROKE = 2.6;
const PADDING_Y = 6;
const KNOB_RIGHT = -2;

const createTugBarStyles = (theme: ITheme, isDone: boolean) => {
	const { colors, radii, shadows } = theme.pace;
	return {
		root: { paddingVertical: PADDING_Y, justifyContent: "center" as const },
		track: {
			height: HEIGHT,
			borderRadius: radii.pill,
			overflow: "hidden" as const,
			backgroundColor: colors.barSoft,
			boxShadow: shadows.progressTrack,
		},
		fill: {
			height: "100%" as const,
			borderRadius: radii.pill,
			overflow: "hidden" as const,
			boxShadow: isDone ? shadows.tugGlowDone : shadows.tugGlow,
		},
		knob: {
			position: "absolute" as const,
			right: KNOB_RIGHT,
			width: KNOB,
			height: KNOB,
			borderRadius: KNOB / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: isDone ? colors.statusSuccess : colors.ink.white,
			boxShadow: shadows.tugKnob,
		},
		knobIcon: isDone ? colors.ink.white : colors.slate[900],
	};
};

// Barra de disputa até a bandeira; na virada vira verde com o "check".
export const TugBar: React.FC<ITugBarProps> = ({ progress, isDone }) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const fill = useViradaFill(progress);
	const styles = createTugBarStyles(theme, isDone);
	const layers = isDone ? theme.pace.gradients.successProgress : theme.pace.gradients.progress;

	return (
		<View style={styles.root}>
			<View style={styles.track} onLayout={onLayout}>
				<Animated.View style={[styles.fill, fill]}>
					{size ? (
						<GradientLayers layers={layers} width={size.width * progress} height={HEIGHT} />
					) : null}
				</Animated.View>
			</View>
			<View style={styles.knob}>
				<Icon
					name={isDone ? "check" : "flag"}
					size={KNOB_ICON}
					strokeWidth={KNOB_STROKE}
					color={styles.knobIcon}
				/>
			</View>
		</View>
	);
};
