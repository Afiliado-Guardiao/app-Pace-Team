import { TextStyle, ViewStyle } from "react-native";

import { tracking } from "@/components/pace";
import { ITheme } from "@/theme";

const CONTENT_TOP_RATIO = 0.355;
const BAR_WIDTH = 44;
const BAR_HEIGHT = 3;
const BAR_BOTTOM = 60;
const SLOGAN_LINE = 1.5;

interface ISplashStyles {
	root: ViewStyle;
	content: ViewStyle;
	slogan: ViewStyle;
	sloganTop: TextStyle;
	sloganBottom: TextStyle;
	track: ViewStyle;
	bar: ViewStyle;
}

export const createSplashStyles = (theme: ITheme, screenHeight: number): ISplashStyles => {
	const { colors, radii, spacing, typography } = theme.pace;
	const size = typography.sizes.body;
	const sloganText: TextStyle = {
		textAlign: "center",
		fontSize: size,
		lineHeight: size * SLOGAN_LINE,
		letterSpacing: tracking(0.24, size),
	};

	return {
		root: { flex: 1 },
		content: {
			position: "absolute",
			left: 0,
			right: 0,
			top: screenHeight * CONTENT_TOP_RATIO,
			alignItems: "center",
			gap: spacing[6] + spacing[1],
		},
		slogan: { alignItems: "center" },
		sloganTop: { ...sloganText, fontFamily: typography.fonts.light, color: colors.ink[200] },
		sloganBottom: { ...sloganText, fontFamily: typography.fonts.bold, color: colors.orange[500] },
		track: {
			position: "absolute",
			bottom: BAR_BOTTOM,
			alignSelf: "center",
			width: BAR_WIDTH,
			height: BAR_HEIGHT,
			borderRadius: radii.pill,
			overflow: "hidden",
			backgroundColor: colors.splashTrack,
		},
		bar: {
			width: "100%",
			height: "100%",
			backgroundColor: colors.orange[500],
			transformOrigin: "left",
		},
	};
};
