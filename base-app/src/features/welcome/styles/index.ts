import { TextStyle, ViewStyle } from "react-native";

import { tracking } from "@/components/pace";
import { ITheme } from "@/theme";

// Telas baixas (Safari com barras, iPhone menor): tudo mais compacto para
// caber até "Entrar com e-mail" sem rolar
export const COMPACT_HEIGHT = 760;
const PADDING_TOP = 60;
const PADDING_TOP_COMPACT = 20;
const PADDING_BOTTOM = 34;
const SPACER_MIN = 300;
const SPACER_MIN_COMPACT = 24;
const TITLE_SIZE = 29;
const TITLE_SIZE_COMPACT = 23;
const TITLE_LINE = 1.12;
const TERMS_SIZE = 11.5;
const TERMS_SIZE_COMPACT = 10.5;
const LINK_OPACITY = 0.85;

export const createWelcomeStyles = (
	theme: ITheme,
	insets: { top: number; bottom: number },
	isCompact = false,
) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const title = isCompact ? TITLE_SIZE_COMPACT : TITLE_SIZE;
	const terms = isCompact ? TERMS_SIZE_COMPACT : TERMS_SIZE;

	return {
		root: { flex: 1, backgroundColor: colors.bgVideo } as ViewStyle,
		content: {
			flex: 1,
			paddingTop: Math.max(insets.top, isCompact ? PADDING_TOP_COMPACT : PADDING_TOP),
			paddingBottom: insets.bottom + (isCompact ? spacing[4] : PADDING_BOTTOM),
			paddingHorizontal: spacing[5] + 2,
		} as ViewStyle,
		logoRow: { alignItems: "center" } as ViewStyle,
		spacer: { flex: 1, minHeight: isCompact ? SPACER_MIN_COMPACT : SPACER_MIN } as ViewStyle,
		headline: { alignItems: "center", marginTop: spacing[3.5] } as ViewStyle,
		slogan: {
			fontFamily: fonts.medium,
			fontSize: isCompact ? sizes.sm : sizes.ui,
			color: colors.textSecondary,
		} as TextStyle,
		title: {
			marginTop: spacing[2],
			textAlign: "center",
			fontFamily: fonts.bold,
			fontSize: title,
			lineHeight: title * TITLE_LINE,
			letterSpacing: tracking(typography.tracking.tight, title),
			color: colors.textPrimary,
		} as TextStyle,
		terms: {
			marginTop: isCompact ? spacing[3] : spacing[5],
			marginBottom: isCompact ? spacing[2.5] : spacing[3.5],
			marginHorizontal: spacing[1],
			textAlign: "center",
			fontFamily: fonts.medium,
			fontSize: terms,
			lineHeight: terms * lineHeights.body,
			color: colors.textSecondary,
		} as TextStyle,
		termsLink: { fontFamily: fonts.bold, color: colors.orange[400] } as TextStyle,
		buttons: { gap: isCompact ? spacing[2] : spacing[2.5] } as ViewStyle,
		buttonContent: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: spacing[2.5],
		} as ViewStyle,
		buttonText: {
			fontFamily: fonts.bold,
			fontSize: isCompact ? sizes.body : sizes.md,
			color: colors.navy[950],
		} as TextStyle,
		emailLink: {
			marginTop: isCompact ? spacing[1] : spacing[3.5],
			alignSelf: "center",
			padding: spacing[2],
			opacity: LINK_OPACITY,
		} as ViewStyle,
		emailText: {
			fontFamily: fonts.semibold,
			fontSize: sizes.sm,
			color: colors.ink.white,
		} as TextStyle,
		catalogText: {
			fontFamily: fonts.medium,
			fontSize: sizes.xs,
			color: colors.textTertiary,
		} as TextStyle,
		spinnerColor: colors.slate[900],
		buttonSize: isCompact ? ("md" as const) : ("lg" as const),
	};
};
