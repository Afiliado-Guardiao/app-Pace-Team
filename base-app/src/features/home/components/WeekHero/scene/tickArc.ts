import { Skia, SkPicture } from "@shopify/react-native-skia";

import { rgba } from "./color";

// Arco de tracinhos do medidor (base 360 × 379 do protótipo)
export const TICKS = 25;
const CENTER = { x: 180, y: 182 };
const OUTER_R = 130;
const TICK_LEN = 15;
const FROM_DEG = 140;
const TO_DEG = 400;
const ORANGE = [253, 90, 12];

// Laranja no começo, clareando até branco no fim do arco
const tickColor = (i: number) => {
	"worklet";
	const f = i / (TICKS - 1);
	const [r, g, b] = ORANGE.map((c) => c + (255 - c) * f);
	return rgba(r, g, b, 1);
};

// Brilho que corre pelos tracinhos acesos (shine 0..1 = do começo ao fim)
const shineBoost = (i: number, lit: number, shine: number): number => {
	"worklet";
	if (shine <= 0 || shine >= 1) return 0;
	const pos = shine * (lit + 3) - 1.5;
	return Math.max(0, 1 - Math.abs(i - pos) / 1.6);
};

export const tickArcPicture = (k: number, lit: number, shine = 0): SkPicture => {
	"worklet";
	const recorder = Skia.PictureRecorder();
	const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, 360 * k, 379 * k));
	const off = Skia.Paint();
	off.setStyle(1);
	off.setStrokeCap(1);
	off.setStrokeWidth(4 * k);
	off.setColor(rgba(255, 255, 255, 0.26));
	const on = Skia.Paint();
	on.setStyle(1);
	on.setStrokeCap(1);
	on.setStrokeWidth(5 * k);
	const glow = on.copy();
	glow.setMaskFilter(Skia.MaskFilter.MakeBlur(0, 4 * k, true));
	for (let i = 0; i < TICKS; i++) {
		const a = ((FROM_DEG + ((TO_DEG - FROM_DEG) * i) / (TICKS - 1)) * Math.PI) / 180;
		const cos = Math.cos(a);
		const sin = Math.sin(a);
		const x0 = (CENTER.x + cos * (OUTER_R - TICK_LEN)) * k;
		const y0 = (CENTER.y + sin * (OUTER_R - TICK_LEN)) * k;
		const x1 = (CENTER.x + cos * OUTER_R) * k;
		const y1 = (CENTER.y + sin * OUTER_R) * k;
		// Acende aos poucos: o último tracinho aceso pode estar pela metade
		const on01 = Math.min(1, Math.max(0, lit - i));
		canvas.drawLine(x0, y0, x1, y1, off);
		if (on01 > 0.02) {
			const boost = on01 >= 0.99 ? shineBoost(i, lit, shine) : 0;
			const color = boost > 0 ? rgba(255, 255, 255, 1) : tickColor(i);
			glow.setColor(boost > 0 ? rgba(255, 190, 140, 1) : color);
			glow.setAlphaf(Math.min(1, 0.55 * on01 + 0.45 * boost));
			glow.setStrokeWidth((5 + 4 * boost) * k);
			canvas.drawLine(x0, y0, x1, y1, glow);
			on.setColor(boost > 0 ? color : tickColor(i));
			on.setAlphaf(boost > 0 ? 0.6 + 0.4 * boost : on01);
			canvas.drawLine(x0, y0, x1, y1, on);
		}
	}
	return recorder.finishRecordingAsPicture();
};
