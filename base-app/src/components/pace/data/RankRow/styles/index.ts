import { ITheme } from "@/theme";

import { tracking } from "../../../utils";
import { IRankRowStyles } from "../types";

const POSITION_WIDTH = 26;
const TAG_PADDING = { vertical: 4, horizontal: 6 };
const DELTA_GAP = 2;
const DELTA_MARGIN = 5;

const medalColor = (theme: ITheme, position: number): string => {
	const { colors } = theme.pace;
	const medals: Record<number, string> = {
		1: colors.rankGold,
		2: colors.rankSilver,
		3: colors.rankBronze,
	};
	return medals[position] ?? colors.textSecondary;
};

const deltaColorOf = (theme: ITheme, delta: number): string => {
	const { colors } = theme.pace;
	if (delta > 0) return colors.statusSuccess;
	return delta < 0 ? colors.statusDanger : colors.textTertiary;
};

export const createRankRowStyles = (
	theme: ITheme,
	options: { position: number; delta: number; isYou: boolean },
): IRankRowStyles => {
	const { blur, colors, radii, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const deltaColor = deltaColorOf(theme, options.delta);

	return {
		surface: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[3],
			paddingVertical: spacing[3],
			paddingHorizontal: spacing[3.5],
		},
		position: {
			width: POSITION_WIDTH,
			textAlign: "center",
			fontFamily: fonts.bold,
			fontSize: sizes.h3,
			color: medalColor(theme, options.position),
		},
		info: { flex: 1, minWidth: 0 },
		nameRow: { flexDirection: "row", alignItems: "center", gap: spacing[1.5] },
		name: {
			flexShrink: 1,
			fontFamily: fonts.bold,
			fontSize: sizes.ui,
			lineHeight: sizes.ui * lineHeights.snug,
			color: colors.textPrimary,
		},
		youTag: {
			paddingVertical: TAG_PADDING.vertical,
			paddingHorizontal: TAG_PADDING.horizontal,
			borderRadius: radii.tag,
			backgroundColor: colors.orange[500],
		},
		youText: {
			fontFamily: fonts.extrabold,
			fontSize: sizes["2xs"],
			letterSpacing: tracking(typography.tracking.tag, sizes["2xs"]),
			color: colors.ink.white,
		},
		sub: {
			marginTop: spacing[1],
			fontFamily: fonts.medium,
			fontSize: sizes.xs,
			lineHeight: sizes.xs * lineHeights.snug,
			color: colors.textTertiary,
		},
		right: { alignItems: "flex-end" },
		points: {
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
		// Texto aninhado: o espaço antes de "pts" faz o papel da margem de 3px
		pointsUnit: { fontFamily: fonts.semibold, fontSize: sizes.micro, color: colors.textTertiary },
		delta: { flexDirection: "row", alignItems: "center", gap: DELTA_GAP, marginTop: DELTA_MARGIN },
		deltaText: { fontFamily: fonts.bold, fontSize: sizes.xs, color: deltaColor },
		appearance: {
			fill: options.isYou ? "rankYou" : "glassFill",
			blur: blur.intensity.glass,
			border: options.isYou ? colors.accentBorderYou : colors.glassBorder,
			rim: true,
			innerShadow: shadows.innerHighlight,
		},
		deltaColor,
	};
};
