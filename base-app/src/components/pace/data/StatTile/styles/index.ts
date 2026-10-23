import { ITheme } from "@/theme";

import { tracking } from "../../../utils";
import { IStatTileSize, IStatTileStyles } from "../types";

const VALUE_SIZE: Record<IStatTileSize, number> = { sm: 20, md: 28, lg: 40 };
const ICON_DOT = 30;
const UNIT_RATIO = 0.42;
const VALUE_GAP = 5;
const LABEL_LINE = 1.15;

export const createStatTileStyles = (
	theme: ITheme,
	options: { size: IStatTileSize; accent: boolean },
): IStatTileStyles => {
	const { borders, colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	const isSmall = options.size === "sm";
	const valueSize = VALUE_SIZE[options.size];
	const highlight = options.accent ? colors.orange[400] : colors.textPrimary;

	return {
		root: { minWidth: 0, gap: isSmall ? spacing[1.5] : spacing[2.5] },
		header: {
			flexDirection: isSmall ? "column" : "row",
			alignItems: isSmall ? "flex-start" : "center",
			gap: isSmall ? spacing[1.5] : spacing[2],
			minWidth: 0,
		},
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			flexShrink: 0,
			borderRadius: ICON_DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			borderWidth: borders.hairline,
			borderColor: colors.glassBorder,
			backgroundColor: options.accent ? colors.accentSoft : colors.glass2,
		},
		label: {
			flexShrink: 1,
			fontFamily: fonts.semibold,
			fontSize: sizes.label,
			lineHeight: sizes.label * LABEL_LINE,
			color: colors.textSecondary,
		},
		valueRow: { flexDirection: "row", alignItems: "baseline", gap: VALUE_GAP },
		value: {
			fontFamily: fonts.bold,
			fontSize: valueSize,
			fontVariant: [...typography.tabularNums],
			letterSpacing: tracking(typography.tracking.tight, valueSize),
			color: highlight,
		},
		unit: {
			fontFamily: fonts.semibold,
			fontSize: Math.max(sizes.xs, Math.round(valueSize * UNIT_RATIO)),
			color: colors.textTertiary,
		},
		sub: {
			fontFamily: fonts.medium,
			fontSize: sizes.xs,
			lineHeight: sizes.xs * typography.lineHeights.snug,
			color: colors.textTertiary,
		},
		iconColor: highlight,
	};
};
