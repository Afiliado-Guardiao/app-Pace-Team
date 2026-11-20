import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const DOT = 10;

export const createTeamPresenceStyles = (
	theme: ITheme,
	o: { size: number; itemW: number; isOnline: boolean },
) => {
	const { colors, typography } = theme.pace;
	const { fonts } = typography;
	return {
		root: { gap: 6 } as ViewStyle,
		header: { flexDirection: "row", alignItems: "center", gap: 6 } as ViewStyle,
		headerDot: {
			width: 8,
			height: 8,
			borderRadius: 4,
			backgroundColor: colors.statusSuccess,
		} as ViewStyle,
		headerText: { fontFamily: fonts.bold, fontSize: 12, color: colors.textPrimary } as TextStyle,
		headerMuted: {
			fontFamily: fonts.medium,
			fontSize: 12,
			color: colors.textSecondary,
		} as TextStyle,
		row: { flexDirection: "row", alignItems: "flex-start" } as ViewStyle,
		divider: {
			width: 1,
			alignSelf: "stretch",
			marginHorizontal: 3,
			marginBottom: 18,
			backgroundColor: colors.glassBorder,
		} as ViewStyle,
		person: {
			width: o.itemW,
			alignItems: "center",
			gap: 3,
			opacity: o.isOnline ? 1 : 0.5,
		} as ViewStyle,
		photo: {
			width: o.size + 4,
			height: o.size + 4,
			borderRadius: (o.size + 4) / 2,
			borderWidth: o.isOnline ? 2 : 0,

			borderColor: colors.statusSuccess,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		dot: {
			position: "absolute",
			right: -2,
			bottom: -2,
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			backgroundColor: colors.statusSuccess,
			borderWidth: 2,
			borderColor: colors.bgSunken,
		} as ViewStyle,
		name: {
			fontFamily: fonts.semibold,
			fontSize: 10,
			lineHeight: 12,
			textAlign: "center",
			color: colors.textPrimary,
		} as TextStyle,
	};
};
