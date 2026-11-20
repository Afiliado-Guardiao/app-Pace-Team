import { TextStyle, ViewStyle } from "react-native";

import { tracking } from "@/components/pace";
import { ITheme } from "@/theme";

const MAP_HEIGHT = 470;
const TOP_SCRIM = 140;
const FADE_TOP = 330;
const FADE_HEIGHT = 160;
const SIDE = 20;
const RIGHT = 76;
const BOTTOM = 40;
const TITLE = 30;

export const createRunSetupStyles = (theme: ITheme, insets: { top: number; bottom: number }) => {
	const { colors, spacing, typography } = theme.pace;

	return {
		root: { flex: 1, backgroundColor: colors.bgApp } as ViewStyle,
		map: { position: "absolute", top: 0, left: 0, right: 0, height: MAP_HEIGHT } as ViewStyle,
		topScrim: { position: "absolute", top: 0, left: 0, right: 0, height: TOP_SCRIM } as ViewStyle,
		fade: {
			position: "absolute",
			top: FADE_TOP,
			left: 0,
			right: 0,
			height: FADE_HEIGHT,
		} as ViewStyle,
		topBar: {
			position: "absolute",
			top: insets.top + 8,
			left: SIDE,
			right: SIDE,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		} as ViewStyle,
		bottom: {
			position: "absolute",
			left: SIDE,
			right: RIGHT,
			bottom: insets.bottom + BOTTOM,
			gap: spacing[3.5],
		} as ViewStyle,
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: TITLE,
			lineHeight: TITLE * 1.1,
			letterSpacing: tracking(typography.tracking.tight, TITLE),
			color: colors.textPrimary,
		} as TextStyle,
		subtitle: {
			marginTop: spacing[2],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * typography.lineHeights.body,
			color: colors.textSecondary,
		} as TextStyle,
		modes: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2] } as ViewStyle,
		mode: { width: "48.5%" } as ViewStyle,
		startRow: { alignItems: "center", marginTop: spacing[1] } as ViewStyle,
	};
};
