// PACE TEAM — sombras e brilhos (tokens/spacing.css + componentes).
// Sintaxe CSS de box-shadow, suportada pelo React Native 0.81 (New Architecture).
// Sombras "inset" ficam separadas: em superfícies de vidro elas são desenhadas
// numa camada acima do preenchimento, como no CSS.

import { paceColors } from "../colors";

const card = "0 20px 40px -20px rgba(8,14,22,.55)";
const float = "0 24px 60px -20px rgba(8,14,22,.7)";
const innerHighlight = "inset 0 1px 0 rgba(255,255,255,.40)";

export const paceShadows = {
	none: "none",
	card,
	float,
	innerHighlight,

	// --shadow-glass = brilho interno + sombra de card
	glassOuter: card,
	glassInner: `${innerHighlight}, inset 0 -1px 0 rgba(255,255,255,.06)`,

	// --glow-accent / --glow-accent-lg
	glowAccentOuter: "0 10px 28px -6px rgba(253,90,12,.65)",
	glowAccentInner: "inset 0 0 0 1px rgba(255,140,70,.35)",
	glowAccentLg: "0 0 0 8px rgba(253,90,12,.12), 0 16px 44px -8px rgba(253,90,12,.75)",

	chipSelected: "0 6px 18px -6px rgba(253,90,12,.7)",
	accentSoftGlow: "0 6px 16px -6px rgba(253,90,12,.8)",
	checkboxOn: "0 4px 12px -4px rgba(253,90,12,.8)",
	inputFocus: "0 0 0 4px rgba(253,90,12,.12)",
	radioDot: "0 0 10px rgba(253,90,12,.8)",
	unreadDot: "0 0 8px rgba(253,90,12,.8)",
	progressGlow: "0 0 12px rgba(253,90,12,.6)",
	barGlow: "0 0 16px rgba(253,90,12,.6)",
	progressTrack: "inset 0 1px 2px rgba(0,0,0,.3)",

	switchTrackOff: "inset 0 0 0 1px rgba(255,255,255,.16)",
	switchThumb: "0 2px 6px rgba(0,0,0,.35)",

	sheetOuter: float,
	sheetInner: "inset 0 1px 0 rgba(255,255,255,.18)",
	toastInner: "inset 0 1px 0 rgba(255,255,255,.16)",
	tooltip: "0 8px 20px -8px rgba(0,0,0,.6)",
	flameAccent: "0 8px 20px -6px rgba(253,90,12,.9)",
	flameSuccess: "0 8px 20px -6px rgba(47,208,138,.8)",
	stackFront: "0 26px 44px -22px rgba(0,0,0,.75)",
	stackBack: "0 14px 30px -18px rgba(0,0,0,.6)",
	feedImage: "0 24px 44px -24px rgba(0,0,0,.8)",
	freshDot: "0 0 0 3px rgba(253,90,12,.25), 0 0 10px rgba(253,90,12,.9)",
	sideUs: "0 0 0 2px #FD5A0C, 0 8px 22px -6px rgba(253,90,12,.8)",
	sideThem: "0 0 0 2px rgba(255,255,255,.55)",
	tugKnob: "0 4px 12px -2px rgba(0,0,0,.5)",
	tugGlow: "0 0 14px rgba(253,90,12,.7)",
	tugGlowDone: "0 0 14px rgba(47,208,138,.7)",
	barAccentGlow: "0 0 10px rgba(253,90,12,.45)",
	orbitTile: "0 12px 28px -10px rgba(0,0,0,.6)",
	orbitIcon: "0 0 0 8px rgba(253,90,12,.12), 0 18px 50px -10px rgba(253,90,12,.85)",

	tabActiveOuter: "0 10px 26px -6px rgba(253,90,12,.85)",
	tabActiveInner: "inset 0 1px 0 rgba(255,255,255,.35)",
	tabAccentOuter: "0 0 0 5px rgba(253,90,12,.14), 0 10px 30px -6px rgba(253,90,12,.9)",
	tabAccentInner: "inset 0 1px 0 rgba(255,255,255,.45)",
	railDiscOuter: "0 8px 22px -6px rgba(253,90,12,.9)",
	railDiscInner: "inset 0 1px 0 rgba(255,255,255,.4)",

	avatarRing: `0 0 0 2px ${paceColors.avatarRing}`,
	avatarRingAccent: `0 0 0 2px ${paceColors.slate[900]}, 0 0 0 4px ${paceColors.orange[500]}`,
	stackRing: `0 0 0 2px ${paceColors.slate[800]}`,

	podiumAvatar: (ringColor: string, isFirst: boolean): string =>
		`0 0 0 2px ${ringColor}, 0 10px 30px -8px ${isFirst ? "rgba(253,90,12,.7)" : "rgba(0,0,0,.6)"}`,
} as const;

export type IPaceShadows = typeof paceShadows;
