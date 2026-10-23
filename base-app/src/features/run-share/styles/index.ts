import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const SIDE = 20;
const BOTTOM = 30;
const RAIL_HEIGHT = 124;

export const createRunShareStyles = (theme: ITheme, insets: { top: number; bottom: number }) => {
	const { colors, spacing, typography } = theme.pace;

	return {
		root: { flex: 1, backgroundColor: colors.bgApp } as ViewStyle,
		column: {
			flex: 1,
			paddingTop: insets.top + 4,
			paddingBottom: Math.max(BOTTOM, insets.bottom),
			paddingHorizontal: SIDE,
			gap: spacing[3.5],
		} as ViewStyle,
		previewArea: {
			flex: 1,
			minHeight: 0,
			alignItems: "center",
			justifyContent: "center",
		} as ViewStyle,
		preview: {
			borderRadius: 24,
			overflow: "hidden",
			borderWidth: 1,
			borderColor: colors.cameraBtnBorder,
			boxShadow: "0 26px 50px -24px rgba(0,0,0,.85)",
		} as ViewStyle,
		tabs: { flexDirection: "row", gap: spacing[2] } as ViewStyle,
		rail: { flexGrow: 0, minHeight: RAIL_HEIGHT } as ViewStyle,
		railContent: {
			gap: spacing[3],
			paddingHorizontal: 2,
			paddingTop: 2,
			paddingBottom: 4,
		} as ViewStyle,
		thumbFill: { width: "100%", height: "100%" } as ImageStyle,
		note: {
			marginTop: -4,
			textAlign: "center",
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.3,
			color: colors.textTertiary,
		} as TextStyle,
	};
};
