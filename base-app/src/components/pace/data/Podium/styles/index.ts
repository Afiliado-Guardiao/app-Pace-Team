import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { AVATAR_SIZE, BLOCK_HEIGHT } from "../constants";
import { IPodiumColumnStyles, IPodiumPlace } from "../types";

const AVATAR_RING_RADIUS = 16;
const BLOCK_BOTTOM_RADIUS = 6;
const BLOCK_PADDING_TOP = 10;

export const createPodiumStyles = (
	theme: ITheme,
): { root: ViewStyle; spacer: (flex: number) => ViewStyle } => ({
	root: { flexDirection: "row", alignItems: "flex-end", gap: theme.pace.spacing[2.5] },
	spacer: (flex) => ({ flex }),
});

export const createPodiumColumnStyles = (
	theme: ITheme,
	place: IPodiumPlace,
	flex: number,
): IPodiumColumnStyles => {
	const { blur, colors, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const isFirst = place === 1;
	const medal: Record<IPodiumPlace, string> = {
		1: colors.rankGold,
		2: colors.rankSilver,
		3: colors.rankBronze,
	};

	return {
		column: { flex, minWidth: 0, alignItems: "center", gap: spacing[2] },
		avatarRing: {
			borderRadius: AVATAR_RING_RADIUS,
			boxShadow: shadows.podiumAvatar(medal[place], isFirst),
		},
		name: {
			maxWidth: "100%",
			textAlign: "center",
			fontFamily: fonts.bold,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.snug,
			color: colors.textPrimary,
		},
		points: { fontFamily: fonts.bold, fontSize: sizes.sm, color: colors.textSecondary },
		block: {
			width: "100%",
			height: BLOCK_HEIGHT[place],
			alignItems: "center",
			paddingTop: BLOCK_PADDING_TOP,
			transformOrigin: "bottom",
		},
		number: { fontFamily: fonts.extrabold, fontSize: sizes.podium, color: medal[place] },
		appearance: {
			fill: isFirst ? "podiumFirst" : "podiumOther",
			blur: blur.intensity.glass,
			border: isFirst ? colors.podiumFirstBorder : colors.glassBorder,
			rim: true,
			innerShadow: shadows.innerHighlight,
			bottomRadius: BLOCK_BOTTOM_RADIUS,
		},
		avatarSize: AVATAR_SIZE[place],
	};
};
