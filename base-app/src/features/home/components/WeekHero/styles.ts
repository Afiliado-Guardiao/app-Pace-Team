import { TextStyle, ViewStyle } from "react-native";

import { BUDDY_W } from "@/components/buddy";
import { ITheme } from "@/theme";

import { HERO } from "./layout";
import { BUDDY_RECT, SCENE_H } from "./scene/geometry";

const ICON_DOT = 44;
const NUMBER_SIZE = 54;
const NUMBER_TOP = 82;
const KM_LABEL = { x: 244, y: 214 };
const ONLINE_Y = 206;
const PILL_HALF = 13;

interface IHeroMetrics {
	k: number;
	ks: number;
	width: number;
	heroY: number;
	frameWidth: number;
	frameHeight: number;
}

// Bud da pista: um pouco mais largo que a pelúcia (ele é deitado, ela era em pé)
const BUD_WIDTH = 1.45;
const BUD_FEET = 104;
const budBox = (ks: number, sceneTop: number) => {
	const scale = (BUDDY_RECT.w * BUD_WIDTH * ks) / BUDDY_W;
	return {
		scale,
		left: (BUDDY_RECT.x + BUDDY_RECT.w / 2) * ks - (BUDDY_W / 2) * scale,
		top: sceneTop + (BUDDY_RECT.y + BUDDY_RECT.h) * ks - BUD_FEET * scale,
	};
};

export const createWeekHeroStyles = (theme: ITheme, m: IHeroMetrics) => {
	const { borders, colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const boxH = HERO.boxHeight * m.k;
	const sceneH = SCENE_H * m.ks;
	const sceneTop = boxH - sceneH;

	return {
		root: { position: "relative" } as ViewStyle,
		titleRow: {
			height: HERO.titleHeight,
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[3],
		} as ViewStyle,
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			borderRadius: ICON_DOT / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.iconDotSoft,
			borderWidth: borders.hairline,
			borderColor: colors.iconDotBorder,
		} as ViewStyle,
		titleText: { flex: 1, minWidth: 0 } as ViewStyle,
		title: {
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			lineHeight: sizes.md * lineHeights.snug,
			color: colors.textPrimary,
		} as TextStyle,
		subtitle: {
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			color: colors.textSecondary,
		} as TextStyle,
		credit: {
			position: "absolute",
			right: 0,
			top: HERO.titleHeight,
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textSecondary,
		} as TextStyle,
		box: { marginTop: HERO.titleGap, height: boxH } as ViewStyle,
		fill: { position: "absolute", left: 0, top: 0, width: m.width, height: boxH } as ViewStyle,
		numberBox: { position: "absolute", top: NUMBER_TOP * m.k, left: 0, right: 0 } as ViewStyle,
		number: {
			textAlign: "center",
			fontFamily: theme.pace.typography.numericFonts.bold,
			fontSize: NUMBER_SIZE * m.k,
			lineHeight: NUMBER_SIZE * m.k * 1.1,
			color: colors.textPrimary,
		} as TextStyle,
		kmLabel: {
			position: "absolute",
			left: KM_LABEL.x * m.k,
			top: KM_LABEL.y * m.k,
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			color: colors.textSecondary,
		} as TextStyle,
		online: { position: "absolute", left: 0, top: ONLINE_Y * m.k - PILL_HALF } as ViewStyle,
		scene: {
			position: "absolute",
			left: 0,
			top: sceneTop,
			width: m.width,
			height: sceneH,
		} as ViewStyle,
		buddyHit: {
			position: "absolute",
			left: BUDDY_RECT.x * m.ks,
			top: sceneTop + BUDDY_RECT.y * m.ks,
			width: BUDDY_RECT.w * m.ks,
			height: BUDDY_RECT.h * m.ks,
		} as ViewStyle,
		// Novo Bud no lugar da pelúcia: mesmo centro, base no mesmo chão
		budBox: budBox(m.ks, sceneTop),
		tiles: { flexDirection: "row", alignItems: "flex-start", gap: spacing[2.5] } as ViewStyle,
		tileLow: { flex: 1, marginTop: HERO.tilesOffset * m.k } as ViewStyle,
		tileHigh: { flex: 1 } as ViewStyle,
		front: {
			position: "absolute",
			top: -m.heroY,
			left: -HERO.gutter,
			width: m.frameWidth,
			height: m.frameHeight,
		} as ViewStyle,
		frontCanvas: { width: m.frameWidth, height: m.frameHeight } as ViewStyle,
	};
};
