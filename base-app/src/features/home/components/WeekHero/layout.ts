import { SCENE_W } from "./scene/geometry";
import { IHeroFrame } from "./scene/types";

// Medidas do bloco "Sua semana" (protótipo com 360 de largura; escala k)
export const HERO = {
	baseWidth: 360,
	titleHeight: 44,
	titleGap: 14,
	boxHeight: 379,
	// Fileira de bolinhas do painel de acrílico, acima da cena do Buddy
	panelTop: 94,
	// No painel, a pista fica logo abaixo das bolinhas (sem o medidor em cima);
	// embaixo dela, quem da equipe está online e quem não
	sceneInBox: 4,
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

// Clima só no card do Buddy: céu, chuva, névoa e nuvens desenhados na caixa
// do card (do topo, atrás das bolinhas, até a pista) e presos a ele; a
// camada vai 150 abaixo para o esmaecer de baixo cair fora do card
export const cardFrame = (width: number): IHeroFrame => {
	const { k } = heroScale(width);
	const boxH = HERO.boxHeight * k;
	// Começa no topo do card (atrás das bolinhas): a chuva cai lá de cima
	const top = HERO.panelTop;
	return {
		sceneX: 0,
		sceneY: top + HERO.sceneInBox * k,
		width,
		height: top + boxH + HERO.below,
		blockBottom: top + boxH,
	};
};
