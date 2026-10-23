import { TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance, tracking } from "@/components/pace";
import { ITheme } from "@/theme";
import { IViradaTone } from "@/lib/pace";

const TITLE_SIZE = 24;
const TITLE_LINE = 1.15;
const VS = 40;
const VS_TOP = 8;
const SECTION_TOP = 16;
const MATCHUP_TOP = 20;

export const createViradaHeroStyles = (theme: ITheme, tone: IViradaTone, isDone: boolean) => {
	const { blur, borders, colors, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const toneColors: Record<IViradaTone, string> = {
		warning: colors.statusWarning,
		accent: colors.orange[400],
		success: colors.statusSuccess,
	};

	return {
		card: { padding: spacing[5] } as ViewStyle,
		appearance: {
			fill: isDone ? "viradaHeroDone" : "viradaHero",
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			outerShadow: shadows.glassOuter,
			innerShadow: shadows.glassInner,
		} as IGlassAppearance,
		center: { alignItems: "center" } as ViewStyle,
		title: {
			marginTop: spacing[3],
			textAlign: "center",
			fontFamily: fonts.extrabold,
			fontSize: TITLE_SIZE,
			lineHeight: TITLE_SIZE * TITLE_LINE,
			color: colors.textPrimary,
		} as TextStyle,
		sub: {
			marginTop: spacing[2],
			textAlign: "center",
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.body,
			color: colors.textSecondary,
		} as TextStyle,
		matchup: { flexDirection: "row", gap: spacing[2.5], marginTop: MATCHUP_TOP } as ViewStyle,
		side: { flex: 1, minWidth: 0 } as ViewStyle,
		vs: { alignItems: "center", gap: spacing[1.5], paddingTop: VS_TOP } as ViewStyle,
		vsBadge: {
			width: VS,
			height: VS,
			borderRadius: VS / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.surfaceTabIdle,
			borderWidth: borders.hairline,
			borderColor: colors.iconDotBorder,
		} as ViewStyle,
		vsText: {
			fontFamily: fonts.extrabold,
			fontSize: sizes.label,
			letterSpacing: tracking(typography.tracking.badge, sizes.label),
			color: colors.textPrimary,
		} as TextStyle,
		tug: { marginTop: SECTION_TOP } as ViewStyle,
		stats: { flexDirection: "row", marginTop: SECTION_TOP } as ViewStyle,
		stat: { flex: 1, alignItems: "center" } as ViewStyle,
		statDivider: {
			borderLeftWidth: borders.hairline,
			borderLeftColor: colors.hairline,
		} as ViewStyle,
		statValue: {
			fontFamily: fonts.bold,
			fontSize: sizes.xl,
			color: colors.textPrimary,
		} as TextStyle,
		statAccent: { color: toneColors[tone] } as TextStyle,
		statLabel: {
			marginTop: spacing[1.5],
			fontFamily: fonts.medium,
			fontSize: sizes.xs,
			color: colors.textTertiary,
		} as TextStyle,
		toneColor: toneColors[tone],
	};
};
