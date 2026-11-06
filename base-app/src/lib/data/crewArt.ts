// Desenho da corrida em grupo (compartilhar, post e feed): todos os
// percursos no mesmo quadro, na mesma escala, cada um no lugar de verdade,
// e as fotos de quem correu sem uma cobrir a outra.

export type IArtPoint = readonly [number, number];

export interface IArtBox {
	x: number;
	y: number;
	w: number;
	h: number;
}

// Percurso de quem correu (lat, lng ou o desenho relativo do servidor)
export interface ICrewLine {
	points: readonly IArtPoint[];
	// Dono da corrida (traçado laranja); os outros vão em outra cor
	isOwner: boolean;
}

// Tudo parado num ponto só: um quadrado de ~5 m em volta, para não explodir
const MIN_SPAN = 0.00005;

const bounds = (points: readonly IArtPoint[]) => {
	const lats = points.map((p) => p[0]);
	const lngs = points.map((p) => p[1]);
	return {
		minLat: Math.min(...lats),
		maxLat: Math.max(...lats),
		minLng: Math.min(...lngs),
		maxLng: Math.max(...lngs),
	};
};

// Encaixa os percursos no retângulo, centralizados e sem distorcer, todos na
// mesma escala. yPerX: quanto vale em y uma unidade de x (arte esticada).
export const fitCrewLines = (
	lines: readonly (readonly IArtPoint[])[],
	box: IArtBox,
	yPerX = 1,
): IArtPoint[][] => {
	const all = lines.flat();
	if (all.length === 0) return lines.map(() => []);
	const b = bounds(all);
	const kx = Math.cos((((b.minLat + b.maxLat) / 2) * Math.PI) / 180);
	const spanX = Math.max((b.maxLng - b.minLng) * kx, MIN_SPAN);
	const spanY = Math.max(b.maxLat - b.minLat, MIN_SPAN);
	const scale = Math.min(box.w / spanX, box.h / (spanY * yPerX));
	const usedW = (b.maxLng - b.minLng) * kx * scale;
	const usedH = (b.maxLat - b.minLat) * scale * yPerX;
	const ox = box.x + (box.w - usedW) / 2;
	const oy = box.y + (box.h - usedH) / 2;
	return lines.map((line) =>
		line.map(
			([lat, lng]) =>
				[ox + (lng - b.minLng) * kx * scale, oy + (b.maxLat - lat) * scale * yPerX] as const,
		),
	);
};

// Caminho SVG de um percurso já encaixado
export const linePath = (points: readonly IArtPoint[], digits = 1): string =>
	points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(digits)} ${y.toFixed(digits)}`).join(" ");

// Medidas do alfinete (foto em cima do ponto) e do nome (embaixo ou em cima)
export interface IPinMetrics {
	pinW: number;
	pinH: number;
	labelW: number;
	labelH: number;
	gap: number;
}

export interface IPlacedPin {
	// Onde fica a foto (pode ter sido afastada para o lado)
	x: number;
	y: number;
	labelAbove: boolean;
	// Ponto no percurso (o pontinho fica sempre nele)
	anchorX: number;
	anchorY: number;
}

interface IRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

const overlaps = (a: IRect, b: IRect): boolean =>
	a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

const rectsOf = (p: IPlacedPin, m: IPinMetrics, hasLabel: boolean): IRect[] => {
	const photo = { x: p.x - m.pinW / 2, y: p.y - m.pinH, w: m.pinW, h: m.pinH };
	if (!hasLabel) return [photo];
	const labelY = p.labelAbove ? p.y - m.pinH - m.gap - m.labelH : p.y + m.gap;
	return [photo, { x: p.x - m.labelW / 2, y: labelY, w: m.labelW, h: m.labelH }];
};

const SHIFTS = [0, 1, -1, 2, -2, 3, -3, 4, -4] as const;

// Faixa da arte onde a foto e o nome cabem inteiros (sem cortar na borda)
export interface IPinBounds {
	minX: number;
	maxX: number;
}

const fits = (rects: readonly IRect[], bounds: IPinBounds | undefined): boolean =>
	!bounds || rects.every((r) => r.x >= bounds.minX && r.x + r.w <= bounds.maxX);

const isFree = (rects: readonly IRect[], taken: readonly IRect[]): boolean =>
	rects.every((r) => taken.every((t) => !overlaps(r, t)));

const clampX = (x: number, m: IPinMetrics, bounds: IPinBounds | undefined): number => {
	if (!bounds) return x;
	const half = Math.max(m.pinW, m.labelW) / 2;
	return Math.min(bounds.maxX - half, Math.max(bounds.minX + half, x));
};

// Lugares para tentar: no ponto, afastando para os lados e, se precisar,
// uma fileira acima ou abaixo (nome embaixo ou em cima)
const candidatesOf = (anchor: IArtPoint, m: IPinMetrics): IPlacedPin[] => {
	const [ax, ay] = anchor;
	const step = m.pinW + m.gap;
	const row = m.pinH + m.labelH + m.gap * 2;
	return [0, -row, row].flatMap((dy) =>
		SHIFTS.flatMap((shift) =>
			[false, true].map((labelAbove) => ({
				x: ax + shift * step,
				y: ay + dy,
				labelAbove,
				anchorX: ax,
				anchorY: ay,
			})),
		),
	);
};

// Primeiro lugar livre que caiba inteiro na arte; sem nenhum, o mais perto
// do ponto, puxado para dentro da borda
const freeSpot = (
	anchor: IArtPoint,
	o: { m: IPinMetrics; hasLabel: boolean; taken: readonly IRect[]; bounds?: IPinBounds },
): IPlacedPin => {
	const candidates = candidatesOf(anchor, o.m);
	const found = candidates.find((c) => {
		const rects = rectsOf(c, o.m, o.hasLabel);
		return isFree(rects, o.taken) && fits(rects, o.bounds);
	});
	if (found) return found;
	const [ax, ay] = anchor;
	return { x: clampX(ax, o.m, o.bounds), y: ay, labelAbove: false, anchorX: ax, anchorY: ay };
};

// Coloca cada foto no ponto dela; se cobrir outra (foto ou nome), põe o nome
// em cima ou afasta para o lado, até achar um lugar livre
export const layoutCrewPins = (
	anchors: readonly IArtPoint[],
	o: { metrics: IPinMetrics; hasLabel: readonly boolean[]; bounds?: IPinBounds },
): IPlacedPin[] => {
	const taken: IRect[] = [];
	return anchors.map((anchor, i) => {
		const hasLabel = o.hasLabel[i] ?? false;
		const chosen = freeSpot(anchor, { m: o.metrics, hasLabel, taken, bounds: o.bounds });
		taken.push(...rectsOf(chosen, o.metrics, hasLabel));
		return chosen;
	});
};

// Onde fica a foto de cada um: no fim do percurso dele; sem percurso, na
// largada de quem tem (ou no meio do quadro)
export const pinAnchors = (
	fitted: readonly (readonly IArtPoint[])[],
	pinLines: readonly number[],
	box: IArtBox,
): IArtPoint[] => {
	const start =
		fitted.find((l) => l.length > 0)?.[0] ?? ([box.x + box.w / 2, box.y + box.h / 2] as const);
	return pinLines.map((line) => fitted[line]?.at(-1) ?? start);
};
