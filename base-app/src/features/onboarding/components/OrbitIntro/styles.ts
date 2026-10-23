import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance, tracking } from "@/components/pace";
import { ITheme } from "@/theme";

import { ORBIT } from "../../constants";

const CAPTION_SIDE = 24;
const CAPTION_LINE = 1.22;
const BRAND_SIZE = 12;
const BRAND_GAP = 18;
const ICON_IMAGE_SCALE = 1.04;

interface IOrbitRing {
	position: ViewStyle;
	size: ViewStyle;
	radius: number;
	appearance: IGlassAppearance;
}

const fill: ImageStyle = { width: "100%", height: "100%", resizeMode: "cover" };

export const createOrbitStyles = (theme: ITheme, center: { x: number; y: number }) => {
	const { colors, shadows, typography } = theme.pace;
	const ringOf = (radius: number, color: string): IOrbitRing => ({
		position: { position: "absolute", left: center.x - radius, top: center.y - radius },
		size: { width: radius * 2, height: radius * 2 },
		radius,
		appearance: { fill: { color }, border: null, rim: true },
	});
	const iconHalf = ORBIT.icon / 2;

	return {
		root: { flex: 1, overflow: "hidden" } as ViewStyle,
		rings: [
			ringOf(ORBIT.radius + ORBIT.ringOuter, colors.orbitRingOuter),
			ringOf(ORBIT.radius + ORBIT.ringInner, colors.orbitRingInner),
		],
		icon: {
			position: "absolute",
			left: center.x - iconHalf,
			top: center.y - iconHalf,
			zIndex: 3,
		} as ViewStyle,
		iconBox: { width: ORBIT.icon, height: ORBIT.icon } as ViewStyle,
		iconImage: { ...fill, transform: [{ scale: ICON_IMAGE_SCALE }] } as ImageStyle,
		iconAppearance: { border: null, rim: true, outerShadow: shadows.orbitIcon } as IGlassAppearance,
		caption: {
			position: "absolute",
			left: CAPTION_SIDE,
			right: CAPTION_SIDE,
			top: center.y + ORBIT.radius + ORBIT.textGap,
			alignItems: "center",
		} as ViewStyle,
		captionText: {
			textAlign: "center",
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.h1,
			lineHeight: typography.sizes.h1 * CAPTION_LINE,
			letterSpacing: tracking(typography.tracking.tight, typography.sizes.h1),
			color: colors.ink.white,
		} as TextStyle,
		brand: {
			marginTop: BRAND_GAP,
			fontFamily: typography.fonts.light,
			fontSize: BRAND_SIZE,
			letterSpacing: tracking(0.24, BRAND_SIZE),
			color: colors.ink[200],
		} as TextStyle,
	};
};

export const createOrbitTileStyles = (theme: ITheme) => ({
	tile: { position: "absolute", left: 0, top: 0, zIndex: 2 } as ViewStyle,
	box: { width: ORBIT.tile, height: ORBIT.tile } as ViewStyle,
	image: fill,
	appearance: {
		border: null,
		rim: true,
		outerShadow: theme.pace.shadows.orbitTile,
	} as IGlassAppearance,
});
