import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const createPrizeLayerStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		backdrop: {
			flex: 1,
			backgroundColor: colors.bgSunken,
			alignItems: "center",
			justifyContent: "center",
			padding: spacing[6],
		} as ViewStyle,
		card: {
			alignItems: "center",
			backgroundColor: colors.bgSunken,
			paddingVertical: spacing[4],
			width: "100%",
		} as ViewStyle,
		stage: { width: 320, height: 320, alignItems: "center", justifyContent: "center" } as ViewStyle,
		kicker: {
			marginTop: spacing[3],
			fontFamily: fonts.bold,
			fontSize: sizes.label,
			letterSpacing: 2,
			color: colors.storyAccentText,
		} as TextStyle,
		title: {
			marginTop: spacing[1.5],
			fontFamily: fonts.extrabold,
			fontSize: 28,
			color: colors.textPrimary,
			textAlign: "center",
		} as TextStyle,
		rule: {
			marginTop: spacing[2],
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			color: colors.textSecondary,
			textAlign: "center",
		} as TextStyle,
		chip: {
			marginTop: spacing[4],
			paddingHorizontal: spacing[4],
			paddingVertical: spacing[2],
			borderRadius: 999,
			borderWidth: 1,
		} as ViewStyle,
		chipOn: { borderColor: colors.statusSuccess, backgroundColor: colors.glass1 } as ViewStyle,
		chipOff: { borderColor: colors.glassBorder, backgroundColor: colors.glass1 } as ViewStyle,
		chipText: {
			fontFamily: fonts.bold,
			fontSize: sizes.sm,
			color: colors.textSecondary,
		} as TextStyle,
		chipTextOn: { color: colors.statusSuccess } as TextStyle,
		actions: { width: "100%", gap: spacing[2.5], marginTop: spacing[5] } as ViewStyle,
		close: { position: "absolute", top: 56, right: 20 } as ViewStyle,
		newTitle: {
			fontFamily: fonts.extrabold,
			fontSize: 26,
			color: colors.accent,
			textAlign: "center",
		} as TextStyle,
		newSub: {
			marginTop: spacing[1],
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			color: colors.textSecondary,
			textAlign: "center",
		} as TextStyle,
		logo: { marginTop: spacing[4] } as ViewStyle,
		confetti: { position: "absolute", left: 0, right: 0, top: 0 } as ViewStyle,
	};
};
