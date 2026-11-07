import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { IMapWorld } from "./geometry";

// Cores da ilustração (chão da floresta embaixo e sombras do cabeçalho)
export const MAP_COLORS = {
	ground: "#22301E",
	groundClear: "rgba(34,48,30,0)",
	headerShade: "rgba(10,16,26,0.92)",
	headerClear: "rgba(10,16,26,0)",
	bottomClear: "rgba(8,14,12,0)",
	bottomShade: "rgba(8,14,12,0.85)",
	pill: "rgba(14,22,32,0.66)",
} as const;

const TRAIL_FADE = 160;
const TOP_SHADE = 300;
const BOTTOM_SHADE = 240;

export const createRankingMapStyles = (
	theme: ITheme,
	o: { world: IMapWorld; insetsTop: number },
) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		root: { flex: 1, backgroundColor: MAP_COLORS.ground } as ViewStyle,
		scroll: { flex: 1 } as ViewStyle,
		world: { height: o.world.height, overflow: "hidden" } as ViewStyle,
		trail: {
			position: "absolute",
			left: o.world.ox,
			top: 0,
			width: o.world.iw,
			height: o.world.ih,
		} as ImageStyle,
		trailEnd: {
			position: "absolute",
			left: 0,
			right: 0,
			top: o.world.ih - TRAIL_FADE,
			height: TRAIL_FADE,
		} as ViewStyle,
		region: {
			position: "absolute",
			left: 16,
			flexDirection: "row",
			alignItems: "center",
			gap: 6,
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 999,
			backgroundColor: MAP_COLORS.pill,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		} as ViewStyle,
		regionDash: { width: 7, height: 1.5, backgroundColor: colors.textPrimary } as ViewStyle,
		regionText: {
			fontFamily: fonts.bold,
			fontSize: 10,
			letterSpacing: 1.6,
			color: colors.textPrimary,
		} as TextStyle,
		more: {
			position: "absolute",
			width: 140,
			alignItems: "center",
			paddingVertical: 6,
			borderRadius: 999,
			backgroundColor: MAP_COLORS.pill,
		} as ViewStyle,
		moreText: {
			fontFamily: fonts.bold,
			fontSize: sizes.label,
			color: colors.textPrimary,
		} as TextStyle,
		topShade: { position: "absolute", top: 0, left: 0, right: 0, height: TOP_SHADE } as ViewStyle,
		bottomShade: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			height: BOTTOM_SHADE,
		} as ViewStyle,
		header: {
			position: "absolute",
			top: o.insetsTop + spacing[2],
			left: 22,
			right: 22,
			gap: spacing[3],
		} as ViewStyle,
		titleRow: { flexDirection: "row", alignItems: "center", gap: spacing[2] } as ViewStyle,
		titleText: { flex: 1 } as ViewStyle,
		title: { fontFamily: fonts.extrabold, fontSize: 30, color: colors.textPrimary } as TextStyle,
		sub: {
			marginTop: 4,
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textSecondary,
		} as TextStyle,
		bottom: { position: "absolute", left: 16, right: 16, bottom: 26, gap: spacing[3] } as ViewStyle,
		controls: { flexDirection: "row", gap: spacing[2] } as ViewStyle,
		emptyAppearance: { fill: { color: colors.glassPanel }, border: colors.glassBorder, rim: true },
		empty: { padding: 18, gap: 6 } as ViewStyle,
		emptyTitle: {
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			color: colors.textPrimary,
		} as TextStyle,
		emptyBody: {
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			color: colors.textSecondary,
		} as TextStyle,
	};
};
