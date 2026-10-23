import { ITheme } from "@/theme";

import { IAvatarStackStyles } from "../types";

const OVERLAP_RATIO = 0.3;
const REST_TEXT_RATIO = 0.34;

export const createAvatarStackStyles = (theme: ITheme, size: number): IAvatarStackStyles => {
	const { colors, shadows, typography } = theme.pace;
	const overlap = -size * OVERLAP_RATIO;

	return {
		root: { flexDirection: "row", alignItems: "center" },
		item: { marginLeft: overlap, borderRadius: size / 2, boxShadow: shadows.stackRing },
		first: { marginLeft: 0 },
		rest: {
			marginLeft: overlap,
			width: size,
			height: size,
			borderRadius: size / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.orange[500],
			boxShadow: shadows.stackRing,
		},
		restText: {
			fontFamily: typography.fonts.bold,
			fontSize: Math.round(size * REST_TEXT_RATIO),
			color: colors.ink.white,
		},
	};
};
