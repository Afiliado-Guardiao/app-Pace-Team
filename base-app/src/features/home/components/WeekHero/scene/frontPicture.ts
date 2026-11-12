import { Skia, SkImage, SkPaint, SkPicture } from "@shopify/react-native-skia";

import { drawFog, drawRain, drawSparseDrops } from "./drawWeatherFront";
import { fadeLayerEdges } from "./layerFade";
import { IHeroFrame, ISceneKit } from "./types";

export interface IBuddyKit {
	image: SkImage;
	paint: SkPaint;
}

// Camada da frente: chuva e névoa por cima de tudo. O Bud da pista é
// desenhado no app (TrackBuddy), com piscada, sono e doença
export const frontPicture = (
	o: { kit: ISceneKit; frame: IHeroFrame; buddy: IBuddyKit },
	t: number,
	_jump: number,
): SkPicture => {
	"worklet";
	const { kit, frame } = o;
	const recorder = Skia.PictureRecorder();
	const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, frame.width, frame.height));
	const hasRain = kit.weather.rain > 0;
	const hasFog = kit.weather.preset === "cold";
	const isCloudy = kit.weather.preset === "cloudy";
	if (hasRain || hasFog || isCloudy) {
		canvas.saveLayer();
		if (hasRain) drawRain(canvas, { kit, frame }, t);
		if (hasFog) drawFog(canvas, { kit, frame }, t);
		if (isCloudy) drawSparseDrops(canvas, { kit, frame }, t);
		fadeLayerEdges(canvas, frame);
	}
	return recorder.finishRecordingAsPicture();
};
