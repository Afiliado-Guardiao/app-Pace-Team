import { ITheme } from "@/theme";

import { tracking } from "../../../utils";
import { IBadgeStyles, IBadgeTone } from "../types";

const HEIGHT = 22;
const DOT = 6;
const PADDING_X = 9;

export const createBadgeStyles = (theme: ITheme, tone: IBadgeTone): IBadgeStyles => {
	const { colors, radii, spacing, typography } = theme.pace;
	const tones: Record<IBadgeTone, [string, string]> = {
		accent: [colors.accentSoft, colors.orange[300]],
		success: [colors.statusSuccessSoft, colors.statusSuccess],
		warning: [colors.statusWarningSoft, colors.statusWarning],
		danger: [colors.statusDangerSoft, colors.statusDanger],
		info: [colors.statusInfoSoft, colors.statusInfo],
		neutral: [colors.glass2, colors.textSecondary],
		solid: [colors.orange[500], colors.ink.white],
	};
	const [background, foreground] = tones[tone];
	const fontSize = typography.sizes.xs;

	return {
		root: {
			flexDirection: "row",
			alignItems: "center",
			alignSelf: "flex-start",
			gap: spacing[1.5],
			height: HEIGHT,
			paddingHorizontal: PADDING_X,
			borderRadius: radii.pill,
			backgroundColor: background,
		},
		dot: { width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: foreground },
		text: {
			fontFamily: typography.fonts.bold,
			fontSize,
			letterSpacing: tracking(typography.tracking.badge, fontSize),
			color: foreground,
		},
	};
};
