import { ITheme } from "@/theme";

import { DISABLED_OPACITY, THUMB, THUMB_INSET, TRACK_HEIGHT, TRACK_WIDTH } from "../constants";
import { ISwitchStyles } from "../types";

export const createSwitchStyles = (
	theme: ITheme,
	options: { isOn: boolean; disabled: boolean },
): ISwitchStyles => {
	const { colors, radii, shadows, spacing, typography } = theme.pace;
	const fontSize = typography.sizes.ui;

	return {
		root: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacing[3],
			opacity: options.disabled ? DISABLED_OPACITY : 1,
		},
		label: {
			flexShrink: 1,
			fontFamily: typography.fonts.medium,
			fontSize,
			lineHeight: fontSize * typography.lineHeights.caption,
			color: colors.textPrimary,
		},
		track: {
			width: TRACK_WIDTH,
			height: TRACK_HEIGHT,
			flexShrink: 0,
			borderRadius: radii.pill,
			boxShadow: options.isOn ? shadows.accentSoftGlow : shadows.switchTrackOff,
		},
		thumb: {
			position: "absolute",
			top: THUMB_INSET,
			left: THUMB_INSET,
			width: THUMB,
			height: THUMB,
			borderRadius: THUMB / 2,
			backgroundColor: colors.ink.white,
			boxShadow: shadows.switchThumb,
		},
	};
};
