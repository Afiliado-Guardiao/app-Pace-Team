import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createGroupRunStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes, tabularNums } = typography;

	return {
		stack: { gap: spacing.stackGap } as ViewStyle,
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
		between: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacing[2],
		} as ViewStyle,
		ran: { fontFamily: fonts.semibold, fontSize: sizes.label, color: colors.ink[200] } as TextStyle,
		totals: {
			flexDirection: "row",
			alignItems: "flex-end",
			justifyContent: "space-between",
			marginTop: 18,
		} as ViewStyle,
		right: { alignItems: "flex-end" } as ViewStyle,
		small: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textSecondary,
		} as TextStyle,
		total: {
			marginTop: spacing[2],
			fontFamily: fonts.bold,
			fontSize: sizes.jumbo,
			lineHeight: sizes.jumbo,
			fontVariant: [...tabularNums],
			color: colors.textPrimary,
		} as TextStyle,
		totalUnit: {
			fontFamily: fonts.medium,
			fontSize: sizes.ui,
			color: colors.textSecondary,
		} as TextStyle,
		points: {
			marginTop: spacing[2],
			fontFamily: fonts.bold,
			fontSize: 24,
			lineHeight: 24,
			color: colors.orange[300],
		} as TextStyle,
		membersHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 6,
		} as ViewStyle,
		membersTitle: {
			fontFamily: fonts.bold,
			fontSize: sizes.body,
			color: colors.textPrimary,
		} as TextStyle,
		hint: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textTertiary,
		} as TextStyle,
		unit: { fontFamily: fonts.medium, fontSize: sizes.xs, color: colors.textTertiary } as TextStyle,
		member: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[3],
			paddingVertical: spacing[3],
		} as ViewStyle,
		memberDivider: { borderTopWidth: 1, borderTopColor: colors.hairline } as ViewStyle,
		memberBody: { flex: 1, minWidth: 0 } as ViewStyle,
		name: {
			fontFamily: fonts.semibold,
			fontSize: sizes.ui,
			color: colors.textPrimary,
		} as TextStyle,
		km: {
			fontFamily: fonts.bold,
			fontSize: sizes.ui,
			fontVariant: [...tabularNums],
			color: colors.textPrimary,
		} as TextStyle,
		barRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: 10,
			marginTop: spacing[2],
		} as ViewStyle,
		bar: { flex: 1 } as ViewStyle,
		pace: {
			width: 40,
			textAlign: "right",
			fontFamily: fonts.medium,
			fontSize: sizes.xs,
			color: colors.textTertiary,
		} as TextStyle,
	};
};
