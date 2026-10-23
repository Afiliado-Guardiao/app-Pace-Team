import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const MAP_HEIGHT = 360;

const SIDE = 20;
const CONTENT_TOP = 300;
const TOOLTIP_TOP = 200;
const TOOLTIP_LEFT = 120;

export const createRunSummaryStyles = (theme: ITheme, insets: { top: number }) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;

	return {
		root: { flex: 1, backgroundColor: colors.bgApp } as ViewStyle,
		map: { position: "absolute", top: 0, left: 0, right: 0, height: MAP_HEIGHT } as ViewStyle,
		topBar: { position: "absolute", top: insets.top + 8, left: SIDE, right: SIDE } as ViewStyle,
		tooltip: { position: "absolute", top: TOOLTIP_TOP, left: TOOLTIP_LEFT } as ViewStyle,
		content: { paddingTop: CONTENT_TOP, paddingLeft: SIDE, paddingRight: SIDE } as ViewStyle,
		meta: {
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			color: colors.textSecondary,
		} as TextStyle,
		title: {
			marginTop: spacing[2],
			fontFamily: fonts.extrabold,
			fontSize: sizes.h1,
			lineHeight: sizes.h1 * 1.15,
			color: colors.textPrimary,
		} as TextStyle,
	};
};
