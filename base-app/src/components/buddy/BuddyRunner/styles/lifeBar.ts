import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { RUNNER_W } from "../script";

interface ILifeBarStyles {
	root: ViewStyle;
	track: ViewStyle;
	fill: ViewStyle;
	point: ViewStyle;
	pointText: TextStyle;
}

const BAR_W = 30;
const BAR_H = 5;

// Verde com a vida cheia, amarelo na metade e vermelho perto de adoecer
const lifeColor = (theme: ITheme, life: number): string => {
	const { colors } = theme.pace;
	if (life > 0.6) return colors.statusSuccess;
	if (life > 0.3) return colors.statusWarning;
	return colors.statusDanger;
};

export const createLifeBarStyles = (theme: ITheme, life: number): ILifeBarStyles => {
	const { colors, typography } = theme.pace;
	return {
		root: {
			position: "absolute",
			left: (RUNNER_W - BAR_W) / 2,
			top: -BAR_H,
			width: BAR_W,
			alignItems: "center",
		},
		track: {
			width: BAR_W,
			height: BAR_H,
			borderRadius: BAR_H / 2,
			padding: 1,
			backgroundColor: "rgba(10,18,32,.55)",
			borderWidth: 0.5,
			borderColor: "rgba(255,255,255,.35)",
		},
		fill: {
			width: (BAR_W - 3) * Math.max(0.06, life),
			height: "100%",
			borderRadius: BAR_H / 2,
			backgroundColor: lifeColor(theme, life),
		},
		point: {
			position: "absolute",
			bottom: BAR_H + 2,
			paddingHorizontal: 5,
			paddingVertical: 1,
			borderRadius: 8,
			backgroundColor: colors.orange[500],
		},
		pointText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 10,
			color: colors.textPrimary,
		},
	};
};
