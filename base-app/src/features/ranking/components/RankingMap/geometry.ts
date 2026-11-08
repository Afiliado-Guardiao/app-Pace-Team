// Mapa "Trilha até o Cume" (prompt do Claude Design): a ilustração vertical
// (753 × 2089) inteira na largura da tela, e as equipes em cima da trilha
// principal — quanto melhor, mais alto. Nunca no caminho do portal de pedra
// e nunca embaixo da barra lateral (x ≤ .64 da imagem).
export const TRAIL = { w: 753, h: 2089 } as const;
const ZOOM = 1;
const EXTRA_BOTTOM = 240;
// Céu a mais em cima: o cume (e a bandeira do 1º) fica abaixo do cabeçalho
const TOP_PAD = 110;

// Pés de cada colocação [fração x, y em px da imagem], medidos na trilha
export const TRAIL_SPOTS: readonly (readonly [number, number])[] = [
	[0.46, 420],
	[0.57, 520],
	[0.44, 565],
	[0.63, 820],
	[0.37, 880],
	[0.59, 960],
	[0.5, 1100],
	[0.3, 1170],
	[0.49, 1260],
	[0.62, 1300],
	[0.61, 1540],
	[0.43, 1600],
	[0.33, 1700],
	[0.49, 1800],
	[0.64, 1845],
];

// Onde fica o "+N equipes" quando há mais equipes que lugares na trilha
export const MORE_SPOT: readonly [number, number] = [0.47, 1980];

export const REGIONS: readonly (readonly [string, number])[] = [
	["Cume", 360],
	["Encosta", 760],
	["Ponte do rio", 1240],
	["Floresta", 1650],
];

export interface IMapWorld {
	iw: number;
	ih: number;
	ox: number;
	oy: number;
	height: number;
	toX: (fx: number) => number;
	toY: (py: number) => number;
}

export const mapWorld = (width: number): IMapWorld => {
	const iw = width * ZOOM;
	const ih = (iw * TRAIL.h) / TRAIL.w;
	const ox = (width - iw) / 2;
	const oy = TOP_PAD;
	return {
		iw,
		ih,
		ox,
		oy,
		height: oy + ih + EXTRA_BOTTOM,
		toX: (fx) => ox + fx * iw,
		toY: (py) => oy + (py / TRAIL.h) * ih,
	};
};

// Mais longe (mais alto) = menor; o 1º no cume fica em 0,95
export const depthScale = (rank: number, y: number, height: number): number =>
	rank === 1 ? 0.95 : 0.72 + 0.3 * (y / height);
