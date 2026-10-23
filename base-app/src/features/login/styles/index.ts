import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const LOGO_TOP = 40;
const HEADER_TOP = 18;
const TITLE_SIZE = 26;

export const createLoginStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const hairline: ViewStyle = { flex: 1, height: 1, backgroundColor: colors.hairline };

	return {
		root: { flex: 1 } as ViewStyle,
		content: { gap: spacing[4.5] } as ViewStyle,
		logo: { alignItems: "center", marginTop: LOGO_TOP } as ViewStyle,
		header: { alignItems: "center", marginTop: HEADER_TOP } as ViewStyle,
		title: {
			fontFamily: fonts.bold,
			fontSize: TITLE_SIZE,
			lineHeight: TITLE_SIZE * lineHeights.snug,
			color: colors.textPrimary,
		} as TextStyle,
		subtitle: {
			marginTop: spacing[1.5],
			fontFamily: fonts.medium,
			fontSize: sizes.ui,
			color: colors.textSecondary,
		} as TextStyle,
		fields: { gap: spacing[3.5], marginTop: spacing[2] } as ViewStyle,
		forgot: { alignSelf: "flex-end", padding: spacing[0.5] } as ViewStyle,
		link: {
			fontFamily: fonts.semibold,
			fontSize: sizes.sm,
			color: colors.orange[400],
		} as TextStyle,
		divider: { flexDirection: "row", alignItems: "center", gap: spacing[3] } as ViewStyle,
		dividerLine: hairline,
		dividerText: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textTertiary,
		} as TextStyle,
		socialRow: { flexDirection: "row", gap: spacing[2.5] } as ViewStyle,
		socialItem: { flex: 1 } as ViewStyle,
		footer: {
			marginTop: spacing[1.5],
			textAlign: "center",
			fontFamily: fonts.medium,
			fontSize: sizes.ui,
			color: colors.textSecondary,
		} as TextStyle,
		footerLink: { fontFamily: fonts.bold, color: colors.orange[400] } as TextStyle,
	};
};
