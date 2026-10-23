// PACE TEAM — gradientes do design system, traduzidos do CSS para camadas SVG.
// Ângulos seguem a convenção CSS (0° = para cima, 90° = para a direita).
// Raios e centros radiais são frações da largura/altura da superfície.
// A ordem das camadas é a do CSS: a primeira fica por cima.

import { paceColors } from "../colors";

export interface IGradientStop {
	offset: number;
	color: string;
}

export interface ILinearGradientLayer {
	type: "linear";
	angle: number;
	stops: readonly IGradientStop[];
}

export interface IRadialGradientLayer {
	type: "radial";
	cx: number;
	cy: number;
	rx: number;
	ry: number;
	stops: readonly IGradientStop[];
}

export type IGradientLayer = ILinearGradientLayer | IRadialGradientLayer;

const linear = (angle: number, stops: IGradientStop[]): ILinearGradientLayer => ({
	type: "linear",
	angle,
	stops,
});

const radial = (
	shape: { cx: number; cy: number; rx: number; ry: number },
	stops: IGradientStop[],
): IRadialGradientLayer => ({ type: "radial", ...shape, stops });

const stop = (offset: number, color: string): IGradientStop => ({ offset, color });

export const paceGradients = {
	// --glass-fill: névoa azul e branca desfocada dos cards de vidro
	glassFill: [
		linear(128, [
			stop(0.14, "rgba(255,255,255,0)"),
			stop(0.27, "rgba(225,242,255,.30)"),
			stop(0.41, "rgba(255,255,255,0)"),
		]),
		linear(128, [
			stop(0.52, "rgba(255,255,255,0)"),
			stop(0.6, "rgba(160,215,255,.16)"),
			stop(0.68, "rgba(255,255,255,0)"),
		]),
		radial({ cx: 0, cy: 0, rx: 0.58, ry: 0.5 }, [
			stop(0, "rgba(240,248,255,.55)"),
			stop(0.72, "rgba(240,248,255,0)"),
		]),
		radial({ cx: 1, cy: 0, rx: 0.8, ry: 0.7 }, [
			stop(0, "rgba(0,4,18,.78)"),
			stop(0.72, "rgba(0,4,18,0)"),
		]),
		radial({ cx: 0.85, cy: 0.6, rx: 0.6, ry: 0.45 }, [
			stop(0, "rgba(0,6,24,.5)"),
			stop(0.7, "rgba(0,6,24,0)"),
		]),
		radial({ cx: 0.5, cy: 1.08, rx: 0.85, ry: 0.62 }, [
			stop(0, "rgba(24,118,255,.72)"),
			stop(0.72, "rgba(24,118,255,0)"),
		]),
		radial({ cx: 0, cy: 1, rx: 0.5, ry: 0.4 }, [
			stop(0, "rgba(140,225,255,.45)"),
			stop(0.72, "rgba(140,225,255,0)"),
		]),
		linear(155, [stop(0, "rgba(255,255,255,.08)"), stop(1, "rgba(4,16,48,.38)")]),
	],

	// --glass-rim: borda branca premium (forte no canto superior esquerdo)
	glassRim: [
		linear(150, [
			stop(0, "rgba(255,255,255,.95)"),
			stop(0.16, "rgba(255,255,255,.45)"),
			stop(0.42, "rgba(255,255,255,.10)"),
			stop(0.62, "rgba(255,255,255,.06)"),
			stop(0.84, "rgba(255,255,255,.22)"),
			stop(1, "rgba(255,255,255,.6)"),
		]),
	],

	// --gradient-accent: botão primário laranja (claro em cima à esquerda)
	accent: [
		radial({ cx: 0.3, cy: 0.25, rx: 1.2, ry: 1.2 }, [
			stop(0, paceColors.orange[300]),
			stop(0.45, paceColors.orange[500]),
			stop(1, paceColors.orange[700]),
		]),
	],

	// --gradient-progress: barras, arco do medidor e destaques de gráfico
	progress: [linear(90, [stop(0, "#FD5A0C"), stop(0.55, "#FF8A45"), stop(1, "#FFE3D1")])],

	scrimBottom: [
		linear(180, [
			stop(0, "rgba(27,39,51,0)"),
			stop(0.55, "rgba(27,39,51,.6)"),
			stop(1, paceColors.slate[900]),
		]),
	],
	// Véu ardósia vertical sobre o fundo de cada tela (ScreenBg)
	// Barras verticais de gráfico: laranja na base, quase branco no topo
	progressVertical: [linear(0, [stop(0, "#FD5A0C"), stop(0.55, "#FF8A45"), stop(1, "#FFE3D1")])],
	// Estado de sucesso (virada concluída)
	success: [linear(140, [stop(0, "#5BE3A6"), stop(1, "#1FAF6E")])],
	successProgress: [linear(90, [stop(0, "#1FAF6E"), stop(0.6, "#2FD08A"), stop(1, "#D9FFE9")])],
	// Card do placar do Modo Virada (laranja; verde na virada)
	viradaHero: [linear(160, [stop(0, "rgba(255,140,80,.32)"), stop(0.65, "rgba(255,255,255,.05)")])],
	viradaHeroDone: [
		linear(160, [stop(0, "rgba(47,208,138,.28)"), stop(0.65, "rgba(255,255,255,.05)")]),
	],
	screenWash: [
		linear(180, [
			stop(0, "rgba(40,62,86,.35)"),
			stop(0.45, "rgba(30,46,62,.5)"),
			stop(1, "rgba(22,34,46,.88)"),
		]),
	],
	// Abertura (vídeo): véu ardósia que escurece para a base
	splashScrim: [
		linear(180, [
			stop(0, "rgba(27,39,51,.35)"),
			stop(0.45, "rgba(27,39,51,.55)"),
			stop(1, "rgba(27,39,51,.95)"),
		]),
	],
	// Boas-vindas (vídeo): topo e base protegidos, meio livre
	welcomeScrim: [
		linear(180, [
			stop(0, "rgba(14,21,28,.55)"),
			stop(0.18, "rgba(14,21,28,0)"),
			stop(0.42, "rgba(14,21,28,0)"),
			stop(0.62, "rgba(14,21,28,.7)"),
			stop(1, "rgba(14,21,28,.96)"),
		]),
	],
	// Apresentação (fotos): base azul-marinho sólida para o texto
	onboardingScrim: [
		linear(180, [
			stop(0, "rgba(27,39,51,.45)"),
			stop(0.3, "rgba(27,39,51,.1)"),
			stop(0.62, "rgba(27,39,51,.75)"),
			stop(1, paceColors.slate[900]),
		]),
	],
	// Animação "órbita" da apresentação
	orbitBg: [
		radial({ cx: 0.5, cy: 0.42, rx: 0.7, ry: 0.5 }, [
			stop(0, paceColors.slate[700]),
			stop(0.7, paceColors.slate[900]),
		]),
	],
	scrimTop: [linear(0, [stop(0, "rgba(27,39,51,0)"), stop(1, "rgba(27,39,51,.65)")])],
	// Arte do post: véu leve no topo e na base da foto
	postArtScrim: [
		linear(180, [
			stop(0, "rgba(0,0,0,.28)"),
			stop(0.34, "rgba(0,0,0,0)"),
			stop(0.7, "rgba(0,0,0,0)"),
			stop(1, "rgba(0,0,0,.35)"),
		]),
	],
	teamMark: [linear(140, [stop(0, "#FF8A3D"), stop(1, "#E04E06")])],
	// Equipe: medalhas (ouro, prata, bronze), colunas do pódio e linha "você"
	medalGold: [linear(145, [stop(0, "#FFF3C4"), stop(0.38, "#F6C94C"), stop(1, "#C98A12")])],
	medalSilver: [linear(145, [stop(0, "#FFFFFF"), stop(0.4, "#D5DCE4"), stop(1, "#8A96A3")])],
	medalBronze: [linear(145, [stop(0, "#FFE0C7"), stop(0.4, "#E0915A"), stop(1, "#9A4E1E")])],
	teamPodiumBar: [linear(180, [stop(0, "rgba(255,255,255,.2)"), stop(1, "rgba(255,255,255,.04)")])],
	memberYou: [linear(110, [stop(0, "rgba(255,140,80,.3)"), stop(1, "rgba(253,90,12,.08)")])],
	// Stories de compartilhar: traçado, barras, marcas e fundos
	storyRoute: [linear(135, [stop(0, "#FFD2B0"), stop(0.45, "#FF7A2E"), stop(1, "#FD5A0C")])],
	storyBar: [linear(90, [stop(0, "#FD5A0C"), stop(0.7, "#FF9A52"), stop(1, "#FFE6D2")])],
	storyMarkNavy: [linear(140, [stop(0, "#3C5A78"), stop(1, "#16222E")])],
	storyMarkPeach: [linear(140, [stop(0, "#FFE0C7"), stop(1, "#9A4E1E")])],
	storyBgOrange: [linear(150, [stop(0, "#FF9A52"), stop(1, "#E04E06")])],
	storyBgNight: [linear(150, [stop(0, "#2C4258"), stop(1, "#0E151C")])],
	storyPhotoScrim: [
		linear(180, [
			stop(0, "rgba(0,0,0,.45)"),
			stop(0.4, "rgba(0,0,0,.1)"),
			stop(1, "rgba(0,0,0,.55)"),
		]),
	],
	// Mapa do resumo da corrida: véu no topo e fusão com o fundo embaixo
	summaryMapFade: [
		linear(180, [
			stop(0, "rgba(27,39,51,.6)"),
			stop(0.3, "rgba(27,39,51,0)"),
			stop(0.6, "rgba(27,39,51,0)"),
			stop(1, paceColors.slate[900]),
		]),
	],

	cardStrong: [linear(155, [stop(0, "rgba(255,255,255,.30)"), stop(1, "rgba(255,255,255,.12)")])],
	cardAccent: [linear(155, [stop(0, "rgba(255,140,80,.34)"), stop(0.6, "rgba(253,90,12,.10)")])],
	cardPhotoScrim: [
		linear(180, [
			stop(0, "rgba(24,36,48,.72)"),
			stop(0.42, "rgba(24,36,48,.2)"),
			stop(0.6, "rgba(24,36,48,.25)"),
			stop(1, "rgba(24,36,48,.85)"),
		]),
	],
	rankYou: [linear(110, [stop(0, "rgba(255,140,80,.32)"), stop(1, "rgba(253,90,12,.08)")])],
	podiumFirst: [linear(180, [stop(0, "rgba(253,90,12,.55)"), stop(1, "rgba(253,90,12,.08)")])],
	podiumOther: [linear(180, [stop(0, "rgba(255,255,255,.16)"), stop(1, "rgba(255,255,255,.03)")])],
	avatar: [linear(140, [stop(0, paceColors.slate[400]), stop(1, paceColors.slate[600])])],
} as const;

export type IPaceGradients = typeof paceGradients;
export type IPaceGradientName = keyof IPaceGradients;
