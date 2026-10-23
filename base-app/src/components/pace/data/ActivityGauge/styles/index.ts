import { ITheme } from "@/theme";

import { HEIGHT_RATIO, TEXT_TOP_RATIO, UNIT_RATIO, VALUE_RATIO } from "../constants";
import { IActivityGaugeStyles } from "../types";

const UNIT_MARGIN = 4;

export const createActivityGaugeStyles = (theme: ITheme, size: number): IActivityGaugeStyles => {
	const { colors, spacing, typography } = theme.pace;
	const valueSize = Math.round(size * VALUE_RATIO);

	return {
		root: { position: "relative", width: size, height: size * HEIGHT_RATIO },
		svg: { position: "absolute", top: 0, left: 0 },
		center: {
			position: "absolute",
			left: 0,
			right: 0,
			top: size * TEXT_TOP_RATIO,
			alignItems: "center",
		},
		value: {
			fontFamily: typography.fonts.bold,
			fontSize: valueSize,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
		unit: {
			fontSize: valueSize * UNIT_RATIO,
			marginLeft: UNIT_MARGIN,
			color: colors.textTertiary,
		},
		label: {
			marginTop: spacing[2],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textSecondary,
		},
		tickColor: colors.tickEmpty,
		glowColor: colors.orange[500],
	};
};
