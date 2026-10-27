import { TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "@/components/pace";
import { ITheme } from "@/theme";

interface IRunReviewStyles {
	backdrop: ViewStyle;
	card: ViewStyle;
	appearance: IGlassAppearance;
	header: ViewStyle;
	titles: ViewStyle;
	title: TextStyle;
	meta: TextStyle;
	map: ViewStyle;
	statusRow: ViewStyle;
	points: TextStyle;
	note: TextStyle;
	row: ViewStyle;
	action: ViewStyle;
}

export const MAP_HEIGHT = 150;

export const createRunReviewStyles = (theme: ITheme): IRunReviewStyles => {
	const { blur, colors, spacing, typography } = theme.pace;
	return {
		backdrop: {
			flex: 1,
			justifyContent: "center",
			paddingHorizontal: spacing[4],
			backgroundColor: colors.surfaceScrim,
		},
		card: { padding: spacing[4], gap: spacing[3] },
		appearance: {
			fill: { color: colors.glassPanel },
			blur: blur.intensity.glass,
			border: colors.glassBorderStrong,
			rim: true,
			outerShadow: "0 24px 60px -18px rgba(0,0,0,.75)",
		},
		header: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
		titles: { flex: 1 },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.xl,
			color: colors.textPrimary,
		},
		meta: {
			marginTop: 2,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		map: {
			height: MAP_HEIGHT,
			borderRadius: 18,
			overflow: "hidden",
			borderWidth: 1,
			borderColor: colors.hairline,
		},
		statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
		points: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.h3,
			color: colors.orange[400],
		},
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
		row: { flexDirection: "row", gap: spacing[2] },
		action: { flex: 1 },
	};
};
