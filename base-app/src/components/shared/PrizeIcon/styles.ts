import { ImageStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const BADGE = 0.44;
const LOCK = 0.32;

export const createPrizeIconStyles = (theme: ITheme, size: number) => {
	const { colors } = theme.pace;
	const badge = size * BADGE;
	return {
		root: { width: size, height: size } as ViewStyle,
		image: { width: size, height: size } as ImageStyle,
		lockBadge: {
			position: "absolute",
			right: -size * 0.04,
			bottom: -size * 0.02,
			width: badge,
			height: badge,
			borderRadius: badge / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.glassPanel,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		} as ViewStyle,
		lock: { width: size * LOCK, height: size * LOCK } as ImageStyle,
	};
};
