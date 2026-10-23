import { ITheme } from "@/theme";

import { IAvatarStyles } from "../types";

const SQUARE_RADIUS_RATIO = 0.3;
const INITIALS_RATIO = 0.36;

export const createAvatarStyles = (
	theme: ITheme,
	size: number,
	options: { ring: boolean; square: boolean },
): IAvatarStyles => {
	const { colors, shadows, typography } = theme.pace;
	const radius = options.square ? Math.round(size * SQUARE_RADIUS_RATIO) : size / 2;

	return {
		root: {
			width: size,
			height: size,
			flexShrink: 0,
			borderRadius: radius,
			boxShadow: options.ring ? shadows.avatarRingAccent : shadows.avatarRing,
		},
		clip: {
			width: size,
			height: size,
			borderRadius: radius,
			overflow: "hidden",
			alignItems: "center",
			justifyContent: "center",
		},
		image: {
			width: size,
			height: size,
			resizeMode: "cover",
		},
		initials: {
			fontFamily: typography.fonts.bold,
			fontSize: Math.round(size * INITIALS_RATIO),
			color: colors.ink[100],
		},
	};
};
