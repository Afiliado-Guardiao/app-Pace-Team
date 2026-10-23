import { TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "@/components/pace";
import { ITheme } from "@/theme";
import { INotification, INotificationTone } from "@/lib/pace";

const ICON_DOT = 42;
const DOT = 8;
const DOT_TOP = 6;
const SUB_TOP = 3;

export const createNotificationItemStyles = (theme: ITheme, item: INotification) => {
	const { blur, borders, colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const tones: Record<INotificationTone, string> = {
		danger: colors.statusDanger,
		accent: colors.orange[400],
		success: colors.statusSuccess,
		neutral: colors.textPrimary,
	};

	return {
		row: { flexDirection: "row", gap: spacing[3], padding: spacing[3.5] } as ViewStyle,
		appearance: {
			fill: "glassFill",
			blur: blur.intensity.glass,
			border: item.unread ? colors.glassBorderStrong : colors.glassBorder,
		} as IGlassAppearance,
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			flexShrink: 0,
			borderRadius: ICON_DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.surfaceIconDot,
			borderWidth: borders.hairline,
			borderColor: colors.hairline,
		} as ViewStyle,
		body: { flex: 1, minWidth: 0 } as ViewStyle,
		titleRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			gap: spacing[2],
		} as ViewStyle,
		title: {
			flexShrink: 1,
			fontFamily: fonts.bold,
			fontSize: sizes.ui,
			lineHeight: sizes.ui * lineHeights.caption,
			color: colors.textPrimary,
		} as TextStyle,
		time: { fontFamily: fonts.medium, fontSize: sizes.xs, color: colors.textTertiary } as TextStyle,
		sub: {
			marginTop: SUB_TOP,
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.toast,
			color: colors.textSecondary,
		} as TextStyle,
		actions: { flexDirection: "row", gap: spacing[2], marginTop: spacing[2.5] } as ViewStyle,
		unreadDot: {
			width: DOT,
			height: DOT,
			marginTop: DOT_TOP,
			borderRadius: DOT / 2,
			flexShrink: 0,
			backgroundColor: colors.orange[500],
			boxShadow: theme.pace.shadows.unreadDot,
		} as ViewStyle,
		toneColor: tones[item.tone],
	};
};
