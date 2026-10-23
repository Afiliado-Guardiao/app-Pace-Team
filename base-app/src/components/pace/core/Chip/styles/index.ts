import { ITheme } from "@/theme";

import { IChipSize, IChipStyles } from "../types";

const SIZES: Record<IChipSize, { height: number; paddingX: number; icon: number }> = {
	sm: { height: 30, paddingX: 12, icon: 14 },
	md: { height: 38, paddingX: 15, icon: 16 },
};
const GAP = 7;

export const createChipStyles = (
	theme: ITheme,
	size: IChipSize,
	selected: boolean,
): IChipStyles => {
	const { blur, colors, shadows, typography } = theme.pace;
	const dims = SIZES[size];

	return {
		pressable: { alignSelf: "flex-start" },
		surface: {
			height: dims.height,
			paddingHorizontal: dims.paddingX,
			flexDirection: "row",
			alignItems: "center",
			gap: GAP,
		},
		text: {
			fontFamily: typography.fonts.semibold,
			fontSize: size === "sm" ? typography.sizes.label : typography.sizes.sm,
			color: selected ? colors.ink.white : colors.textPrimary,
		},
		appearance: selected
			? {
					fill: { color: colors.orange[500] },
					blur: blur.intensity.glass,
					border: colors.transparent,
					rim: true,
					outerShadow: shadows.chipSelected,
				}
			: {
					fill: { color: colors.glass2 },
					blur: blur.intensity.glass,
					border: colors.glassBorder,
					rim: true,
					innerShadow: shadows.innerHighlight,
				},
		radius: dims.height / 2,
		iconSize: dims.icon,
	};
};
