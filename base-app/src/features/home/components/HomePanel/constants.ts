import { Easing } from "react-native-reanimated";

// Painel de seções do Início (card de acrílico): medidas do protótipo do
// Claude Design (360 de largura), lente das bolinhas e tons do acrílico.

export type IPanelSectionId =
	| "points"
	| "buddy"
	| "run"
	| "wheel"
	| "ranking"
	| "team"
	| "ai"
	| "hydration"
	| "studio"
	| "analytics";

export type IProSectionId = "ai" | "hydration" | "studio" | "analytics";

export interface IPanelSection {
	id: IPanelSectionId;
	// null = o rosto do Buddy no lugar do ícone
	icon: string | null;
	label: string;
	isPro?: boolean;
}

// Ordem das bolinhas (o app abre em Pontos)
export const PANEL_SECTIONS: readonly IPanelSection[] = [
	{ id: "points", icon: "zap", label: "Pontos" },
	{ id: "buddy", icon: null, label: "Buddy" },
	{ id: "run", icon: "footprints", label: "Corrida" },
	{ id: "wheel", icon: "dices", label: "Roleta" },
	{ id: "ranking", icon: "mountain-snow", label: "Ranking" },
	{ id: "team", icon: "users", label: "Equipe" },
	{ id: "ai", icon: "sparkles", label: "PACE AI", isPro: true },
	{ id: "hydration", icon: "droplets", label: "Água", isPro: true },
	{ id: "studio", icon: "palette", label: "Studio", isPro: true },
	{ id: "analytics", icon: "chart-column", label: "Analytics", isPro: true },
];

export const BUDDY_INDEX = PANEL_SECTIONS.findIndex((s) => s.id === "buddy");

export const PANEL = {
	baseWidth: 360,
	radius: 32,
	bubblesHeight: 94,
	// Área das seções: 360 × 379 (a mesma caixa da cena do Buddy)
	sectionHeight: 379,
	bubbleCenterY: 40,
	labelTop: 76,
	// Foto 16 px maior que o card de cada lado (o desfoque não deixa borda)
	photoBleed: 16,
	photoBlur: 3,
};

// Lente olho-de-peixe: tamanho e deslocamento por distância da seção atual
export const LENS = {
	sizes: [56, 42, 34, 27, 22],
	offsets: [0, 52, 93, 126, 152],
	fadeFrom: 2.6,
	fadeTo: 3.4,
	// Abaixo disso a bolinha não recebe toque
	touchMin: 0.3,
	iconRatio: 0.42,
};

export const SWIPE = {
	startX: 8,
	cancelY: 10,
	edge: 0.3,
	threshold: 0.18,
	// Toque logo depois de um arraste é ignorado (não abre botão sem querer)
	clickGuardMs: 350,
};

export const PANEL_EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const PANEL_MS = 550;
// Mola leve das barras, anéis e números ao entrar na seção
export const GROW_EASE = Easing.bezier(0.34, 1.3, 0.64, 1);
export const GROW_MS = 1300;

// Tons do acrílico (foto laranja por trás)
export const ACRYLIC = {
	base: "#5A1A06",
	shadeTop: "rgba(40,10,0,.18)",
	shadeMid: "rgba(30,8,0,.32)",
	shadeBottom: "rgba(12,4,0,.62)",
	shine: "rgba(255,255,255,.16)",
	border: "rgba(255,255,255,.30)",
	shadow:
		"inset 0 1.5px 0 rgba(255,255,255,.35), inset 0 0 0 1px rgba(255,255,255,.04), 0 28px 56px -26px rgba(0,0,0,.95)",
	bubbleBorder: "rgba(255,255,255,.32)",
	bubbleBorderOn: "rgba(255,255,255,.50)",
	bubbleShadow:
		"inset 0 1.5px 0 rgba(255,255,255,.55), inset 0 -8px 14px rgba(0,0,0,.22), 0 10px 20px -10px rgba(0,0,0,.6)",
	glassBox: "rgba(255,255,255,.06)",
	glassBoxBorder: "rgba(255,255,255,.12)",
	button: "rgba(255,255,255,.08)",
	buttonBorder: "rgba(255,255,255,.20)",
	tickOff: "rgba(255,255,255,.28)",
	peach: "#FFC08A",
	textShadow: "rgba(0,0,0,.6)",
	white85: "rgba(255,255,255,.85)",
	white75: "rgba(255,255,255,.75)",
	ringA: "#FFE3D1",
	ringB: "#FF8A45",
};
