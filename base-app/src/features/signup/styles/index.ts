import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const PHOTO = 76;
const BADGE = 26;
const BADGE_OFFSET = -2;
const DASHED = 1.5;

export const createSignupStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;

	return {
		root: { flex: 1 } as ViewStyle,
		photoRow: { flexDirection: "row", alignItems: "center", gap: spacing[4] } as ViewStyle,
		photo: {
			width: PHOTO,
			height: PHOTO,
			borderRadius: PHOTO / 2,
			borderWidth: DASHED,
			borderStyle: "dashed",
			borderColor: colors.glassBorderStrong,
			backgroundColor: colors.glass1,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		photoBadge: {
			position: "absolute",
			right: BADGE_OFFSET,
			bottom: BADGE_OFFSET,
			width: BADGE,
			height: BADGE,
			borderRadius: BADGE / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.orange[500],
			boxShadow: `0 0 0 3px ${colors.slate[900]}`,
		} as ViewStyle,
		photoTitle: {
			fontFamily: fonts.semibold,
			fontSize: sizes.ui,
			color: colors.textPrimary,
		} as TextStyle,
		photoHint: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textTertiary,
		} as TextStyle,
		row: { flexDirection: "row", gap: spacing[2.5] } as ViewStyle,
		city: { flex: 1.4 } as ViewStyle,
		state: { flex: 1 } as ViewStyle,
		termsLink: { color: colors.orange[400], fontFamily: fonts.semibold } as TextStyle,
		note: {
			textAlign: "center",
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.body,
			color: colors.textTertiary,
		} as TextStyle,
		iconColor: colors.textSecondary,
	};
};
