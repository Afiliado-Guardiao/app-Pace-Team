import { BlendMode, SkCanvas, Skia } from "@shopify/react-native-skia";

import { rgba } from "./color";
import { hash, pointAt, TRACK_PATH, TRACK_RECT } from "./geometry";
import { ISceneKit } from "./types";

const EDGE = 1.5;
const FOG_BLOBS = 6;
const FOG_LAP_S = 34;
const FLASH_STEP_S = 0.12;
const FLASH_CHANCE = 0.07;

// Abre a camada dos efeitos, já cortada no retângulo da pista
const openTrackLayer = (canvas: SkCanvas): void => {
	"worklet";
	canvas.saveLayer();
	const r = TRACK_RECT;
	// Recorte sem suavizar: com borda suavizada a máscara não apaga a beirada
	canvas.clipRect(Skia.XYWHRect(r.x + EDGE, r.y + EDGE, r.w - EDGE * 2, r.h - EDGE * 2), 1, false);
};

// Recorta o que foi desenhado desde o saveLayer pelo formato da pista
const maskByTrack = (canvas: SkCanvas, kit: ISceneKit): void => {
	"worklet";
	const mask = Skia.Paint();
	mask.setBlendMode(BlendMode.DstIn);
	const r = TRACK_RECT;
	const src = Skia.XYWHRect(0, 0, kit.track.width(), kit.track.height());
	canvas.drawImageRect(kit.track, src, Skia.XYWHRect(r.x, r.y, r.w, r.h), mask);
	canvas.restore();
};

// Névoa baixa correndo sobre a pista (frio)
const drawLowFog = (canvas: SkCanvas, kit: ISceneKit, t: number): void => {
	"worklet";
	openTrackLayer(canvas);
	const paint = Skia.Paint();
	paint.setColor(rgba(225, 238, 255, 0.16));
	paint.setMaskFilter(Skia.MaskFilter.MakeBlur(0, 16, true));
	for (let i = 0; i < FOG_BLOBS; i++) {
		const p = pointAt(TRACK_PATH, i / FOG_BLOBS + t / FOG_LAP_S);
		canvas.drawCircle(p.x, p.y, 34 + hash(i) * 16, paint);
	}
	maskByTrack(canvas, kit);
};

// Relâmpago ocasional, só sobre a pista (temporal)
const drawLightning = (canvas: SkCanvas, kit: ISceneKit, t: number): void => {
	"worklet";
	const step = Math.floor(t / FLASH_STEP_S);
	if (hash(step * 3.17) > FLASH_CHANCE) return;
	const fade = 1 - (t / FLASH_STEP_S - step);
	openTrackLayer(canvas);
	const paint = Skia.Paint();
	paint.setColor(rgba(235, 242, 255, 0.55 * fade));
	const r = TRACK_RECT;
	canvas.drawRect(Skia.XYWHRect(r.x, r.y, r.w, r.h), paint);
	maskByTrack(canvas, kit);
};

export const drawTrackFx = (canvas: SkCanvas, kit: ISceneKit, t: number): void => {
	"worklet";
	if (kit.weather.preset === "cold") drawLowFog(canvas, kit, t);
	if (kit.weather.rain > 0.8) drawLightning(canvas, kit, t);
};
