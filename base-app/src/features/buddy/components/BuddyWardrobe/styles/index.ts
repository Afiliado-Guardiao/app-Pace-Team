import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

// Grades de cores e acessórios do "Seu Buddy"
export const createBuddyWardrobeStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;

	return {
		section: { gap: 10 } as ViewStyle,
		grid: (gap: number): ViewStyle => ({ flexDirection: "row", flexWrap: "wrap", gap }),
		cell: (width: number, isSelected: boolean, opacity: number): ViewStyle => ({
			width,
			alignItems: "center",
			gap: 3,
			paddingTop: 5,
			paddingBottom: 8,
			borderRadius: 16,
			backgroundColor: isSelected ? "rgba(253,90,12,.16)" : "rgba(255,255,255,.06)",
			borderWidth: isSelected ? 1.5 : 1,
			borderColor: isSelected ? colors.accent : "rgba(255,255,255,.14)",
			opacity,
		}),
		name: (size: number): TextStyle => ({
			fontFamily: typography.fonts.bold,
			fontSize: size,
			lineHeight: size * 1.2,
			color: colors.textPrimary,
			textAlign: "center",
		}),
		sub: (size: number): TextStyle => ({
			fontFamily: typography.fonts.medium,
			fontSize: size,
			lineHeight: size * 1.2,
			color: colors.textTertiary,
			textAlign: "center",
		}),
		lock: {
			position: "absolute",
			top: 6,
			right: 6,
			width: 20,
			height: 20,
			borderRadius: 10,
			backgroundColor: "rgba(20,30,40,.7)",
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: 11.5,
			lineHeight: 11.5 * 1.45,
			color: colors.textTertiary,
		} as TextStyle,
	};
};
