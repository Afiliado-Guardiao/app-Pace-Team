import { TextStyle, ViewStyle } from "react-native";

import { BUDDY_H, BUDDY_W } from "@/components/buddy";
import { ITheme } from "@/theme";

import { ROUTE_BOX, ROUTE_TEXT as T, STOPS } from "./geometry";

// Margem das etapas (a arte vai de ponta a ponta, como no rascunho)
const BLEED = 22;

export const createPlanRouteStyles = (theme: ITheme, s: number) => {
	const { colors, typography } = theme.pace;
	const circle = (o: { x: number; y: number; r: number }, fill: string): ViewStyle => ({
		position: "absolute",
		left: (o.x - o.r) * s,
		top: (o.y - o.r) * s,
		width: o.r * 2 * s,
		height: o.r * 2 * s,
		borderRadius: o.r * s,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: fill,
	});
	const text = (size: number, bold: boolean, color: string): TextStyle => ({
		fontFamily: bold ? typography.fonts.bold : typography.fonts.regular,
		fontSize: size * s,
		color,
	});
	const budW = STOPS.bud.w * s;
	return {
		root: {
			marginHorizontal: -BLEED,
			width: ROUTE_BOX.w * s,
			height: ROUTE_BOX.h * s,
		} as ViewStyle,
		svg: { position: "absolute", left: 0, top: 0 } as ViewStyle,
		title: {
			position: "absolute",
			left: T.title.x * s,
			top: T.title.y * s,
			...text(T.title.size, false, colors.textMuted),
		} as TextStyle,
		team: circle(STOPS.team, colors.textPrimary),
		trend: circle(STOPS.trend, colors.textPrimary),
		prize: circle(STOPS.prize, colors.trophyGold),
		glow: {
			...circle({ ...STOPS.prize, r: STOPS.prize.r * 1.65 }, colors.trophyGlow),
			boxShadow: `0 0 ${String(26 * s)}px ${colors.trophyGlow}`,
		} as ViewStyle,
		bud: {
			position: "absolute",
			left: STOPS.bud.x * s - budW / 2,
			top: STOPS.bud.y * s - (budW * BUDDY_H) / BUDDY_W / 2,
			width: budW,
			height: (budW * BUDDY_H) / BUDDY_W,
		} as ViewStyle,
		budInner: { transformOrigin: "0% 0%", transform: [{ scale: budW / BUDDY_W }] } as ViewStyle,
		label: { position: "absolute" } as ViewStyle,
		strong: text(T.team.size, true, colors.textMuted),
		strongWhite: text(T.bud.size, true, colors.textPrimary),
		soft: {
			...text(T.team.subSize, false, colors.textMuted),
			lineHeight: T.bud.line * s,
		} as TextStyle,
		right: { textAlign: "right" } as TextStyle,
		colors,
	};
};
