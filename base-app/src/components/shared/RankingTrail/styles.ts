import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

// Caixa do competidor antes da escala (pés no canto de baixo, x −30)
const BOX = { w: 70, h: 84, dx: 30 } as const;
const SPRITE_H = 56;
const SPRITE_W = 40;
const LABEL_H = 26;

export const initialsOf = (name: string): string =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w.charAt(0))
		.join("")
		.toUpperCase();

// Ouro, prata e bronze no top 3; laranja na sua equipe; branco nas outras
export const accentOf = (theme: ITheme, rank: number, isMine: boolean): string => {
	const { colors } = theme.pace;
	if (isMine) return colors.accent;
	if (rank === 1) return colors.rankGold;
	if (rank === 2) return colors.rankSilver;
	if (rank === 3) return colors.rankBronze;
	return colors.textPrimary;
};

interface ICompetitorStyleOptions {
	x: number;
	y: number;
	scale: number;
	accent: string;
	isSelected: boolean;
	isMine: boolean;
	rank: number;
}

export const createCompetitorStyles = (theme: ITheme, o: ICompetitorStyleOptions) => {
	const { colors, typography } = theme.pace;
	const medal = o.rank <= 3 && !o.isMine;
	const labelW = o.isMine || o.isSelected ? 190 : 46;
	return {
		hit: {
			position: "absolute",
			left: o.x - labelW / 2,
			top: o.y - BOX.h * o.scale - 18,
			width: labelW,
			height: BOX.h * o.scale + 18 + LABEL_H + 10,
			zIndex: Math.round(o.y) + (o.isSelected ? 4000 : 0),
			alignItems: "center",
		} as ViewStyle,
		box: {
			position: "absolute",
			left: labelW / 2 - BOX.dx,
			top: 18,
			width: BOX.w,
			height: BOX.h,
		} as ViewStyle,
		groupScale: {
			width: BOX.w,
			height: BOX.h,
			transform: [{ scale: o.scale }],
			transformOrigin: `${String(BOX.dx)}px ${String(BOX.h)}px`,
		} as ViewStyle,
		shadow: {
			position: "absolute",
			left: BOX.dx - 31,
			top: BOX.h - 6,
			width: 62,
			height: 12,
			borderRadius: 6,
			backgroundColor: colors.navy[950],
			opacity: 0.35,
		} as ViewStyle,
		pole: {
			position: "absolute",
			left: 0,
			top: 4,
			width: 3,
			height: 80,
			borderRadius: 2,
			backgroundColor: colors.ink.white,
		} as ViewStyle,
		ball: {
			position: "absolute",
			left: -2.5,
			top: 0,
			width: 8,
			height: 8,
			borderRadius: 4,
			backgroundColor: o.accent,
		} as ViewStyle,
		flag: {
			position: "absolute",
			left: 3,
			top: 4,
			width: 52,
			height: 36,
			overflow: "hidden",
			alignItems: "center",
			justifyContent: "center",
			borderWidth: 2,
			borderColor: o.accent,
			borderTopLeftRadius: 2,
			borderBottomLeftRadius: 2,
			borderTopRightRadius: 7,
			borderBottomRightRadius: 7,
			backgroundColor: colors.navy[900],
			transformOrigin: "left center",
			boxShadow: o.isMine ? `0 0 10px ${colors.accent}` : undefined,
		} as ViewStyle,
		flagImage: { width: "100%", height: "100%" } as ImageStyle,
		flagInitials: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 14,
			color: colors.textPrimary,
		} as TextStyle,
		crown: { position: "absolute", left: 20, top: -16 } as ViewStyle,
		you: {
			position: "absolute",
			left: 11,
			top: -14,
			paddingHorizontal: 5,
			paddingVertical: 1,
			borderRadius: 7,
			backgroundColor: colors.accent,
		} as ViewStyle,
		youText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 9,
			color: colors.ink.white,
		} as TextStyle,
		runner: {
			position: "absolute",
			left: 22 - 8,
			bottom: 0,
			width: SPRITE_W,
			height: SPRITE_H,
		} as ViewStyle,
		runnerImage: { width: SPRITE_W, height: SPRITE_H } as ImageStyle,
		flip: { transform: [{ scaleX: -1 }] } as ImageStyle,
		label: {
			position: "absolute",
			top: BOX.h * o.scale + 18 + 6,
			flexDirection: "row",
			alignItems: "center",
			gap: 6,
			paddingHorizontal: 4,
			paddingVertical: 3,
			borderRadius: 13,
			maxWidth: labelW,
			borderWidth: 1,
			backgroundColor: o.isSelected && !o.isMine ? "rgba(253,90,12,0.30)" : "rgba(21,21,21,0.74)",
			borderColor: o.isSelected && !o.isMine ? colors.accent : colors.glassBorder,
		} as ViewStyle,
		badge: {
			minWidth: 26,
			paddingHorizontal: 5,
			height: 18,
			borderRadius: 9,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: o.isMine ? colors.accent : medal ? o.accent : colors.glass2,
		} as ViewStyle,
		badgeText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 12,
			color: medal ? colors.navy[950] : colors.ink.white,
		} as TextStyle,
		name: {
			flexShrink: 1,
			paddingRight: 6,
			fontFamily: typography.fonts.bold,
			fontSize: 11,
			color: colors.textPrimary,
		} as TextStyle,
	};
};
