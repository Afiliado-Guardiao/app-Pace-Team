import { ITheme } from "@/theme";

import { IToastStyles, IToastTone } from "../types";

const MAX_WIDTH = 380;
const ICON_DOT = 38;
const TEXT_GAP = 3;
const PADDING_RIGHT = 14;

const TONE_ICON: Record<IToastTone, string> = {
	accent: "trending-up",
	success: "circle-check",
	warning: "triangle-alert",
	danger: "circle-x",
	info: "info",
};

export const createToastStyles = (theme: ITheme, tone: IToastTone): IToastStyles => {
	const { blur, colors, shadows, spacing, typography } = theme.pace;
	const { sizes, fonts, lineHeights } = typography;
	const toneColor: Record<IToastTone, string> = {
		accent: colors.orange[500],
		success: colors.statusSuccess,
		warning: colors.statusWarning,
		danger: colors.statusDanger,
		info: colors.statusInfo,
	};

	return {
		surface: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[3],
			maxWidth: MAX_WIDTH,
			padding: spacing[3],
			paddingRight: PADDING_RIGHT,
		},
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			flexShrink: 0,
			borderRadius: ICON_DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.surfaceIconDot,
		},
		texts: { flex: 1, minWidth: 0, gap: TEXT_GAP },
		title: {
			fontFamily: fonts.bold,
			fontSize: sizes.ui,
			lineHeight: sizes.ui * lineHeights.snug,
			color: colors.textPrimary,
		},
		message: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.toast,
			color: colors.textSecondary,
		},
		actionButton: { padding: spacing[1] },
		actionText: { fontFamily: fonts.bold, fontSize: sizes.sm, color: colors.orange[400] },
		appearance: {
			fill: { color: colors.glassToast },
			blur: blur.intensity.toast,
			border: colors.glassBorder,
			rim: true,
			outerShadow: shadows.float,
			innerShadow: shadows.toastInner,
		},
		toneColor: toneColor[tone],
		toneIcon: TONE_ICON[tone],
	};
};
