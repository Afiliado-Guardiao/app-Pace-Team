import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createHydroSetupStyles = (theme: ITheme, top: number, bottom: number) => {
	const { colors, typography, spacing, radii } = theme.pace;
	return {
		root: {
			...({ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const),
			backgroundColor: colors.bgApp,
			paddingTop: top + spacing[2],
			paddingBottom: bottom + spacing[4],
			paddingHorizontal: 20,
		} as ViewStyle,
		head: { flexDirection: "row", alignItems: "center", gap: spacing[3] } as ViewStyle,
		pill: {
			paddingVertical: spacing[2],
			paddingHorizontal: spacing[4],
			borderRadius: radii.pill,
			borderWidth: 1,
			borderColor: colors.glassBorder,
			backgroundColor: colors.glass1,
		} as ViewStyle,
		pillText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		} as TextStyle,
		bars: { flexDirection: "row", gap: 6, marginTop: spacing[5] } as ViewStyle,
		bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.barTrack } as ViewStyle,
		barOn: { backgroundColor: colors.accent } as ViewStyle,
		kicker: {
			marginTop: spacing[4],
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			letterSpacing: 1.6,
			color: colors.textTertiary,
		} as TextStyle,
		title: {
			marginTop: spacing[1.5],
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.h2,
			color: colors.textPrimary,
		} as TextStyle,
		lead: {
			marginTop: spacing[2],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textSecondary,
		} as TextStyle,
		body: { flex: 1, justifyContent: "center", gap: spacing[3] } as ViewStyle,
		bud: { alignSelf: "center" } as ViewStyle,
		valueRow: {
			flexDirection: "row",
			alignItems: "baseline",
			justifyContent: "center",
		} as ViewStyle,
		value: {
			fontFamily: typography.numericFonts.bold,
			fontSize: 58,
			color: colors.textPrimary,
		} as TextStyle,
		unit: {
			marginLeft: spacing[1.5],
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.h3,
			color: colors.textSecondary,
		} as TextStyle,
		hint: {
			textAlign: "center",
			fontFamily: typography.handFonts.regular,
			fontSize: typography.sizes.h3,
			color: colors.textSecondary,
		} as TextStyle,
		health: { gap: spacing[3] } as ViewStyle,
		steps: {
			flexDirection: "row",
			justifyContent: "center",
			gap: spacing[4],
			marginTop: spacing[3],
		} as ViewStyle,
		step: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textDisabled,
		} as TextStyle,
		stepOn: { color: colors.textPrimary } as TextStyle,
	};
};
