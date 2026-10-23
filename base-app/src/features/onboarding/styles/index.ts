import { TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance, tracking } from "@/components/pace";
import { ITheme } from "@/theme";

const SIDE = 20;
const TOP_GAP = 8;
const BOTTOM = 40;
const TITLE_LINE = 1.12;
const TEXT_LINE = 1.5;
const TEXT_MAX = 320;
const DOT = 7;
const DOT_ACTIVE = 22;
const BAR_PADDING = 10;
const BAR_PADDING_LEFT = 20;
const BOTTOM_GAP = 22;
// Telas baixas (Safari com barras, iPhone menor): título e espaços menores
export const COMPACT_HEIGHT = 760;
const BOTTOM_COMPACT = 20;
const BOTTOM_GAP_COMPACT = 16;

export const createOnboardingStyles = (
	theme: ITheme,
	insets: { top: number },
	isCompact = false,
) => {
	const { blur, colors, radii, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	const titleSize = isCompact ? sizes.display : sizes.jumbo;
	const textSize = isCompact ? sizes.ui : sizes.body;
	const dot: ViewStyle = { height: DOT, borderRadius: radii.xs / 2 };

	return {
		root: { flex: 1, backgroundColor: colors.bgApp } as ViewStyle,
		topBar: {
			position: "absolute",
			top: insets.top + TOP_GAP,
			left: SIDE,
			right: SIDE,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			zIndex: 5,
		} as ViewStyle,
		topBarEnd: { justifyContent: "flex-end" } as ViewStyle,
		bottom: {
			position: "absolute",
			left: SIDE,
			right: SIDE,
			bottom: isCompact ? BOTTOM_COMPACT : BOTTOM,
			gap: isCompact ? BOTTOM_GAP_COMPACT : BOTTOM_GAP,
		} as ViewStyle,
		caption: { gap: isCompact ? spacing[2.5] : spacing[3.5] } as ViewStyle,
		title: {
			fontFamily: fonts.extrabold,
			fontSize: titleSize,
			lineHeight: titleSize * TITLE_LINE,
			letterSpacing: tracking(-0.02, titleSize),
			color: colors.ink.white,
		} as TextStyle,
		text: {
			maxWidth: TEXT_MAX,
			fontFamily: fonts.medium,
			fontSize: textSize,
			lineHeight: textSize * TEXT_LINE,
			color: colors.textSecondary,
		} as TextStyle,
		bar: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			padding: BAR_PADDING,
			paddingLeft: BAR_PADDING_LEFT,
		} as ViewStyle,
		barAppearance: {
			fill: { color: colors.glass1 },
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			outerShadow: shadows.glassOuter,
			innerShadow: shadows.glassInner,
		} as IGlassAppearance,
		dots: { flexDirection: "row", gap: spacing[1.5] } as ViewStyle,
		dot: { ...dot, width: DOT, backgroundColor: colors.dotIdle } as ViewStyle,
		dotActive: { ...dot, width: DOT_ACTIVE, backgroundColor: colors.orange[500] } as ViewStyle,
	};
};
