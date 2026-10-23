import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "@/components/pace";
import { ITheme } from "@/theme";

const RANK_HEIGHT = 28;
const RANK_PADDING = 10;
const HEART_HALF = 42;
const RANK_BLUR = 70;

export const createFeedPostStyles = (theme: ITheme, aspectRatio: number) => {
	const { colors, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;

	return {
		post: { gap: spacing[3] } as ViewStyle,
		header: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[2.5],
			paddingHorizontal: spacing[1],
		} as ViewStyle,
		author: { flex: 1, minWidth: 0 } as ViewStyle,
		name: {
			fontFamily: fonts.bold,
			fontSize: sizes.ui,
			lineHeight: sizes.ui * lineHeights.snug,
			color: colors.textPrimary,
		} as TextStyle,
		with: { fontFamily: fonts.medium, color: colors.textSecondary } as TextStyle,
		meta: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.caption,
			color: colors.textSecondary,
		} as TextStyle,
		rank: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[1],
			height: RANK_HEIGHT,
			paddingHorizontal: RANK_PADDING,
		} as ViewStyle,
		rankAppearance: {
			fill: "glassFill",
			blur: RANK_BLUR,
			border: colors.glassBorder,
			rim: true,
		} as IGlassAppearance,
		rankText: {
			fontFamily: fonts.bold,
			fontSize: sizes.label,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		} as TextStyle,
		imageBox: { width: "100%", aspectRatio } as ViewStyle,
		imageAppearance: {
			border: colors.feedBorder,
			rim: true,
			outerShadow: shadows.feedImage,
		} as IGlassAppearance,
		image: { width: "100%", height: "100%", resizeMode: "cover" } as ImageStyle,
		heart: {
			position: "absolute",
			left: "50%",
			top: "45%",
			marginLeft: -HEART_HALF,
			marginTop: -HEART_HALF,
		} as ViewStyle,
		actions: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[4.5],
			paddingHorizontal: spacing[1.5],
		} as ViewStyle,
		action: { flexDirection: "row", alignItems: "center", gap: spacing[1.5] } as ViewStyle,
		count: {
			fontFamily: fonts.bold,
			fontSize: sizes.sm,
			fontVariant: [...typography.tabularNums],
			color: colors.ink.white,
		} as TextStyle,
		countLiked: { color: colors.orange[500] } as TextStyle,
		caption: {
			paddingHorizontal: spacing[1.5],
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			lineHeight: sizes.sm * lineHeights.body,
			color: colors.textSecondary,
		} as TextStyle,
		captionName: { fontFamily: fonts.bold, color: colors.ink.white } as TextStyle,
	};
};
