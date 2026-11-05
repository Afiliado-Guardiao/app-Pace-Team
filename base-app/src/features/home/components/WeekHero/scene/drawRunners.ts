import { SkCanvas, SkFont, Skia } from "@shopify/react-native-skia";

import { rgba } from "./color";
import { BEHIND_BUDDY, pointAt, TRACK_PATH } from "./geometry";
import { ISceneKit } from "./types";

const LAP_S = 16;
const SPACING = 0.055;
const STRIDE = 11;
const BOUNCE = 1.6;
const ORANGE = rgba(253, 90, 12, 1);
const LABEL_DARK = rgba(12, 22, 34, 1);
const LABEL_BORDER = rgba(255, 255, 255, 1);

interface IRunnerSpot {
	i: number;
	x: number;
	y: number;
	h: number;
	flip: boolean;
	alpha: number;
}

// Some aos poucos ao passar por trás do Buddy (reta do fundo)
const behindAlpha = (x: number, y: number): number => {
	"worklet";
	const b = BEHIND_BUDDY;
	if (y >= b.maxY) return 1;
	const inside = Math.min(x - b.minX, b.maxX - x);
	if (inside <= 0) return 1;
	return Math.max(0, 1 - inside / b.fade);
};

const spotOf = (i: number, t: number): IRunnerSpot => {
	"worklet";
	const u = 0.02 + i * SPACING - t / (LAP_S * (1 + (i % 3) * 0.025));
	const p = pointAt(TRACK_PATH, u);
	const bounce = Math.abs(Math.sin(t * STRIDE + i * 1.7)) * BOUNCE;
	// Anda para trás no caminho (u diminui); a figura olha para a esquerda
	return {
		i,
		x: p.x,
		y: p.y - bounce,
		h: 30 + ((p.y - 234) / 135) * 16,
		flip: p.dx < 0,
		alpha: behindAlpha(p.x, p.y),
	};
};

export const runnerSpots = (count: number, t: number): IRunnerSpot[] => {
	"worklet";
	const spots: IRunnerSpot[] = [];
	for (let i = 0; i < count; i++) spots.push(spotOf(i, t));
	// Quem está mais no fundo é desenhado antes
	return spots.sort((a, b) => a.y - b.y);
};

// Figuras dos corredores, no espaço da cena (canvas já em escala ks)
export const drawRunnerSprites = (canvas: SkCanvas, kit: ISceneKit, spots: IRunnerSpot[]): void => {
	"worklet";
	const paint = kit.tonePaint.copy();
	for (const s of spots) {
		if (s.alpha <= 0.01) continue;
		const img = kit.sprites[s.i];
		const w = (s.h * img.width()) / img.height();
		paint.setAlphaf(s.alpha);
		canvas.save();
		canvas.translate(s.x, s.y);
		if (s.flip) canvas.scale(-1, 1);
		const src = Skia.XYWHRect(0, 0, img.width(), img.height());
		canvas.drawImageRect(img, src, Skia.XYWHRect(-w / 2, -s.h, w, s.h), paint);
		canvas.restore();
	}
};

const drawLabel = (
	canvas: SkCanvas,
	o: { text: string; x: number; y: number; isMe: boolean; alpha: number },
	font: SkFont,
): void => {
	"worklet";
	const size = font.getSize();
	const tw = font.getGlyphWidths(font.getGlyphIDs(o.text)).reduce((a, b) => a + b, 0);
	const padX = size * 0.55;
	const rect = Skia.XYWHRect(o.x - tw / 2 - padX, o.y - size * 1.5, tw + padX * 2, size * 1.5);
	const rrect = Skia.RRectXY(rect, size * 0.75, size * 0.75);
	const fill = Skia.Paint();
	fill.setColor(o.isMe ? ORANGE : LABEL_DARK);
	fill.setAlphaf(o.alpha * (o.isMe ? 1 : 0.74));
	if (o.isMe) {
		const glow = fill.copy();
		glow.setMaskFilter(Skia.MaskFilter.MakeBlur(0, size * 0.6, true));
		glow.setAlphaf(o.alpha * 0.7);
		canvas.drawRRect(rrect, glow);
	}
	canvas.drawRRect(rrect, fill);
	if (!o.isMe) {
		const border = Skia.Paint();
		border.setStyle(1);
		border.setStrokeWidth(0.6);
		border.setColor(LABEL_BORDER);
		border.setAlphaf(o.alpha * 0.22);
		canvas.drawRRect(rrect, border);
	}
	const ink = Skia.Paint();
	ink.setColor(rgba(255, 255, 255, 1));
	ink.setAlphaf(o.alpha);
	canvas.drawText(o.text, o.x - tw / 2, o.y - size * 0.42, ink, font);
};

// Nome em cima da cabeça (em pontos de tela: não escala nem espelha)
export const drawRunnerLabels = (canvas: SkCanvas, kit: ISceneKit, spots: IRunnerSpot[]): void => {
	"worklet";
	if (!kit.font) return;
	for (const s of spots) {
		if (s.alpha <= 0.01) continue;
		const x = s.x * kit.ks;
		const y = (s.y - s.h - 2) * kit.ks;
		drawLabel(
			canvas,
			{ text: kit.names[s.i], x, y, isMe: kit.isMe[s.i], alpha: s.alpha },
			kit.font,
		);
	}
};
