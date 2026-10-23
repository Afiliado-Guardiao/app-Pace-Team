// Degradês do Pace Buddy (CSS do design → camadas SVG do GradientLayers).
import { IGradientLayer } from "@/theme";
import { BUDDY_COLORS, IBuddyColorId, IBuddyPalette } from "@/lib/buddy/constants";

const stop = (offset: number, color: string) => ({ offset, color });

export const paletteOf = (color: IBuddyColorId): IBuddyPalette => BUDDY_COLORS[color];

// radial-gradient(130% 110% at 30% 12%, c0 0%, c1 38%, c2 68%, c3 100%)
export const bodyLayers = (pal: IBuddyPalette): IGradientLayer[] => [
	{
		type: "radial",
		cx: 0.3,
		cy: 0.12,
		rx: 1.3,
		ry: 1.1,
		stops: [stop(0, pal.c[0]), stop(0.38, pal.c[1]), stop(0.68, pal.c[2]), stop(1, pal.c[3])],
	},
];

// Cromado das cores de ranking: dois brilhos + faixas metálicas
export const chromeLayers = (pal: IBuddyPalette, isBig: boolean): IGradientLayer[] => {
	const m = pal.m ?? ["#fff", "#eee", "#999", "#666", "#eee", "#aaa"];
	return [
		{
			type: "radial",
			cx: isBig ? 0.27 : 0.34,
			cy: isBig ? 0.19 : 0.26,
			rx: isBig ? 0.24 : 0.42,
			ry: isBig ? 0.18 : 0.32,
			stops: [stop(0, "rgba(255,255,255,.98)"), stop(1, "rgba(255,255,255,0)")],
		},
		{
			type: "radial",
			cx: 0.7,
			cy: 0.82,
			rx: 0.6,
			ry: 0.3,
			stops: [stop(0, "rgba(255,255,255,.55)"), stop(1, "rgba(255,255,255,0)")],
		},
		{
			type: "linear",
			angle: 178,
			stops: [
				stop(0, m[0]),
				stop(0.3, m[1]),
				stop(0.46, m[2]),
				stop(0.53, m[3]),
				stop(0.72, m[4]),
				stop(1, m[5]),
			],
		},
	];
};

// Mãos: radial-gradient(90% 70% at 34% 24%, c0, c1 45%, c2 85%, c3)
export const handLayers = (pal: IBuddyPalette): IGradientLayer[] =>
	pal.metal
		? chromeLayers(pal, false)
		: [
				{
					type: "radial",
					cx: 0.34,
					cy: 0.24,
					rx: 0.9,
					ry: 0.7,
					stops: [stop(0, pal.c[0]), stop(0.45, pal.c[1]), stop(0.85, pal.c[2]), stop(1, pal.c[3])],
				},
			];

// Sombras internas do corpo (volume e brilho), desenhadas sobre o degradê
export const bodyInsetShadow = (pal: IBuddyPalette): string =>
	pal.metal
		? `inset 0 0 0 1.5px rgba(255,255,255,.6), inset -6px -8px 12px ${pal.sh}, inset 4px 4px 8px rgba(255,255,255,.65)`
		: `inset -7px -9px 14px ${pal.sh}, inset 5px 5px 10px rgba(255,255,255,.95)`;

// Sombra projetada e brilho em volta (laranja nas cores comuns, metálico no ranking)
export const bodyOuterShadow = (pal: IBuddyPalette): string =>
	pal.metal
		? `0 16px 22px -12px rgba(0,0,0,.6), 0 0 28px 3px ${pal.glow ?? "transparent"}`
		: "0 16px 22px -12px rgba(0,0,0,.6), 0 10px 24px -8px rgba(253,90,12,.42)";

// Laranja dos acessórios (faixa, pompom do boné)
export const ORANGE_LAYERS: IGradientLayer[] = [
	{
		type: "linear",
		angle: 180,
		stops: [stop(0, "#FF9A5C"), stop(0.55, "#FD5A0C"), stop(1, "#CD3600")],
	},
];
