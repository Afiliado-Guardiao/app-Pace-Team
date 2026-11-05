import { Skia, SkImage, SkPaint, SkPicture } from "@shopify/react-native-skia";

import { drawFog, drawRain } from "./drawWeatherFront";
import { BUDDY_RECT } from "./geometry";
import { fadeLayerEdges } from "./layerFade";
import { IHeroFrame, ISceneKit } from "./types";

export interface IBuddyKit {
	image: SkImage;
	paint: SkPaint;
}

// Pulinho ao tocar no Buddy (0..1): sobe 8 e amassa de leve
const JUMP_Y = 8;
const SQUASH = 0.05;

// Camada da frente: chuva e névoa por cima de tudo, e o Buddy por último
// (nada do clima cai nele)
export const frontPicture = (
	o: { kit: ISceneKit; frame: IHeroFrame; buddy: IBuddyKit },
	t: number,
	jump: number,
): SkPicture => {
	"worklet";
	const { kit, frame, buddy } = o;
	const recorder = Skia.PictureRecorder();
	const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, frame.width, frame.height));
	const hasRain = kit.weather.rain > 0;
	const hasFog = kit.weather.preset === "cold";
	if (hasRain || hasFog) {
		canvas.saveLayer();
		if (hasRain) drawRain(canvas, { kit, frame }, t);
		if (hasFog) drawFog(canvas, { kit, frame }, t);
		fadeLayerEdges(canvas, frame);
	}
	const b = BUDDY_RECT;
	const lift = Math.sin(Math.PI * jump);
	const w = b.w * kit.ks;
	const h = b.h * kit.ks;
	const x = frame.sceneX + b.x * kit.ks;
	const bottom = frame.sceneY + (b.y + b.h) * kit.ks;
	canvas.save();
	canvas.translate(x + w / 2, bottom - lift * JUMP_Y * kit.k);
	canvas.scale(1 + lift * SQUASH, 1 - lift * SQUASH);
	const src = Skia.XYWHRect(0, 0, buddy.image.width(), buddy.image.height());
	canvas.drawImageRect(buddy.image, src, Skia.XYWHRect(-w / 2, -h, w, h), buddy.paint);
	canvas.restore();
	return recorder.finishRecordingAsPicture();
};
