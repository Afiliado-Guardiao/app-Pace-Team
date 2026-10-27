import { ITheme } from "@/theme";

import { IScreenScrollStyles } from "../types";

const TOP_GAP = 8;
const SIDE_GUTTER = 22;
const RAIL_BOTTOM = 44;
const DEFAULT_BOTTOM = 40;

export const createScreenScrollStyles = (
	theme: ITheme,
	options: { insets: { top: number; bottom: number }; hasRail: boolean; bottom?: number },
): IScreenScrollStyles => {
	const { layout, spacing } = theme.pace;
	const bottom = options.bottom ?? (options.hasRail ? RAIL_BOTTOM : DEFAULT_BOTTOM);

	return {
		scroll: { flex: 1 },
		content: {
			paddingTop: options.insets.top + TOP_GAP,
			paddingLeft: SIDE_GUTTER,
			paddingRight: options.hasRail ? layout.railPaddingRight : SIDE_GUTTER,
			paddingBottom: options.insets.bottom + bottom,
			gap: spacing.stackGap,
		},
		backdrop: {
			position: "absolute",
			top: options.insets.top + TOP_GAP,
			left: 0,
			right: 0,
			bottom: 0,
		},
	};
};
