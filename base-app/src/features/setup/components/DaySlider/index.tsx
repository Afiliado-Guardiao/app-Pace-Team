import React from "react";
import { View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { useDaySlider } from "../../hooks/useDaySlider";
import { pctWidth } from "../../utils/pct";

interface IDaySliderProps {
	value: number;
	max: number;
	onChange: (value: number) => void;
}

const TRACK = 6;
const THUMB = 22;

const createDaySliderStyles = (theme: ITheme) => {
	const { colors, radii } = theme.pace;
	return {
		root: { flex: 1, height: THUMB + 10, justifyContent: "center" as const },
		track: { height: TRACK, borderRadius: radii.pill, backgroundColor: colors.barTrack },
		fill: {
			position: "absolute" as const,
			left: 0,
			height: TRACK,
			borderRadius: radii.pill,
			backgroundColor: colors.accent,
		},
		thumb: {
			position: "absolute" as const,
			width: THUMB,
			height: THUMB,
			marginLeft: -THUMB / 2,
			borderRadius: THUMB / 2,
			backgroundColor: colors.accent,
			borderWidth: 3,
			borderColor: colors.onAccent,
			boxShadow: theme.pace.shadows.accentSoftGlow,
		},
	};
};

// Controle deslizante "Dias sem correr" (0–7)
export const DaySlider: React.FC<IDaySliderProps> = ({ value, max, onChange }) => {
	const { theme } = useTheme();
	const styles = createDaySliderStyles(theme);
	const slider = useDaySlider(max, onChange);
	const at = pctWidth(value / max);

	return (
		<View
			style={styles.root}
			onLayout={slider.onLayout}
			onStartShouldSetResponder={() => true}
			onMoveShouldSetResponder={() => true}
			onResponderGrant={slider.onTouch}
			onResponderMove={slider.onTouch}
			accessibilityRole="adjustable"
			accessibilityLabel="Dias sem correr"
			testID="setup-days-slider"
		>
			<View style={styles.track} pointerEvents="none" />
			<View style={[styles.fill, { width: at }]} pointerEvents="none" />
			<View style={[styles.thumb, { left: at }]} pointerEvents="none" />
		</View>
	);
};
