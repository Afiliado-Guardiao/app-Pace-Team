import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

// Tela "Seu Buddy" (mesmo visual da folha do design: fundo escuro, voltar + título)
export const createBuddyScreenStyles = (theme: ITheme, top: number) => {
	const { colors, shadows, typography } = theme.pace;

	return {
		root: { flex: 1, backgroundColor: colors.bgApp } as ViewStyle,
		header: {
			flexDirection: "row",
			alignItems: "center",
			gap: 12,
			paddingTop: top,
			paddingHorizontal: 20,
			paddingBottom: 12,
		} as ViewStyle,
		back: {
			width: 38,
			height: 38,
			borderRadius: 19,
			borderWidth: 1,
			borderColor: "rgba(255,255,255,.22)",
			backgroundColor: "rgba(255,255,255,.1)",
			boxShadow: shadows.innerHighlight,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		titles: { gap: 2, flexShrink: 1 } as ViewStyle,
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 20,
			lineHeight: 22,
			color: colors.textPrimary,
		} as TextStyle,
		subtitle: {
			fontFamily: typography.fonts.medium,
			fontSize: 12,
			lineHeight: 15.6,
			color: colors.textSecondary,
		} as TextStyle,
		scroll: { paddingTop: 8, paddingHorizontal: 20, paddingBottom: 36, gap: 22 } as ViewStyle,
	};
};
