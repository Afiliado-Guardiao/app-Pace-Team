import { TextStyle, ViewStyle } from "react-native";

import { tracking } from "@/components/pace";
import { ITheme } from "@/theme";

export const SCRIM_TOP = 230;
export const SCRIM_BOTTOM = 380;

const SIDE = 22;
const BOTTOM = 40;
const TITLE = 30;
const TIME = 64; // --fs-metric-xl
const PHOTO = 30;
const PIN = 44;

export const createRunLiveStyles = (theme: ITheme, insets: { top: number; bottom: number }) => {
	const { blur, colors, spacing, typography } = theme.pace;
	const secondary = (size: number): TextStyle => ({
		fontFamily: typography.fonts.medium,
		fontSize: size,
		color: colors.textSecondary,
	});

	return {
		root: { flex: 1, backgroundColor: colors.bgApp } as ViewStyle,
		topScrim: { position: "absolute", top: 0, left: 0, right: 0, height: SCRIM_TOP } as ViewStyle,
		bottomScrim: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			height: SCRIM_BOTTOM,
		} as ViewStyle,
		top: {
			position: "absolute",
			top: insets.top + 8,
			left: SIDE,
			right: SIDE,
			gap: spacing[3.5],
		} as ViewStyle,
		titlePill: { flexDirection: "row", alignItems: "center", gap: spacing[2] } as ViewStyle,
		titlePillText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		} as TextStyle,
		title: {
			marginTop: spacing[1],
			fontFamily: typography.fonts.extrabold,
			fontSize: TITLE,
			lineHeight: TITLE * 1.1,
			letterSpacing: tracking(typography.tracking.tight, TITLE),
			color: colors.textPrimary,
		} as TextStyle,
		crew: { flexDirection: "row", alignItems: "center", gap: 10 } as ViewStyle,
		photos: { flexDirection: "row" } as ViewStyle,
		photo: {
			width: PHOTO,
			height: PHOTO,
			borderRadius: PHOTO / 2,
			boxShadow: `0 0 0 2px ${colors.slate[800]}`,
		},
		photoOverlap: { marginLeft: -9 },
		crewText: secondary(typography.sizes.sm),
		bottom: {
			position: "absolute",
			left: SIDE,
			right: SIDE,
			bottom: insets.bottom + BOTTOM,
			alignItems: "center",
			gap: spacing[3.5],
		} as ViewStyle,
		center: { alignItems: "center" } as ViewStyle,
		time: {
			fontFamily: typography.fonts.bold,
			fontSize: TIME,
			lineHeight: TIME,
			letterSpacing: tracking(-0.02, TIME),
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		} as TextStyle,
		timeLabel: { ...secondary(typography.sizes.sm), marginTop: spacing[2] } as TextStyle,
		distance: { alignItems: "center", gap: 6 } as ViewStyle,
		pin: { width: PIN, height: PIN, alignItems: "center", justifyContent: "center" } as ViewStyle,
		pinAppearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		km: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.h2,
			color: colors.textPrimary,
			fontVariant: [...typography.tabularNums],
		} as TextStyle,
		kmLabel: secondary(typography.sizes.label),
		pausedActions: { flexDirection: "row", alignItems: "flex-end", gap: 10 } as ViewStyle,
		pausedColumn: { gap: spacing[2] } as ViewStyle,
		controls: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			width: "100%",
			marginTop: spacing[1],
		} as ViewStyle,
	};
};
