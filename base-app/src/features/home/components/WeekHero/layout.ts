import { SCENE_H, SCENE_W } from "./scene/geometry";
import { IHeroFrame } from "./scene/types";

// Medidas do bloco "Sua semana" (protótipo com 360 de largura; escala k)
export const HERO = {
	baseWidth: 360,
	titleHeight: 44,
	titleGap: 14,
	boxHeight: 379,
	tilesOffset: 34,
	// Céu e chuva vão até 150 abaixo do bloco
	below: 150,
	// Mesmo respiro lateral e do topo do ScreenScroll
	gutter: 22,
	scrollTop: 8,
};

export const heroScale = (width: number): { k: number; ks: number } => ({
	k: width / HERO.baseWidth,
	ks: width / SCENE_W,
});

// Topo da cena dentro do bloco (a cena fica embaixo da caixa do medidor)
export const sceneTopInHero = (width: number): number => {
	const { k, ks } = heroScale(width);
	return HERO.titleHeight + HERO.titleGap + HERO.boxHeight * k - SCENE_H * ks;
};

// Camadas de tela cheia (céu e frente) começam no topo da tela: o bloco
// está em heroY a partir dali (com a tela rolada no início)
export const heroFrame = (o: {
	heroY: number;
	width: number;
	height: number;
	screenWidth: number;
}): IHeroFrame => {
	const blockBottom = o.heroY + o.height;
	return {
		sceneX: HERO.gutter,
		sceneY: o.heroY + sceneTopInHero(o.width),
		width: o.screenWidth,
		height: blockBottom + HERO.below,
		blockBottom,
	};
};
