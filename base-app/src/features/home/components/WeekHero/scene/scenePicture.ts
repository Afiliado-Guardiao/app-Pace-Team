import { Skia, SkPicture } from "@shopify/react-native-skia";

import { drawRunnerLabels, drawRunnerSprites, runnerSpots } from "./drawRunners";
import { drawTrackFx } from "./drawTrackFx";
import { SCENE_H, SCENE_W } from "./geometry";
import { ISceneKit } from "./types";

// Um quadro da cena: pista parada + corredores + efeitos da pista
export const scenePicture = (kit: ISceneKit, t: number): SkPicture => {
	"worklet";
	const recorder = Skia.PictureRecorder();
	const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, SCENE_W * kit.ks, SCENE_H * kit.ks));
	const spots = runnerSpots(kit.names.length, t);
	canvas.save();
	canvas.scale(kit.ks, kit.ks);
	canvas.drawPicture(kit.base);
	drawRunnerSprites(canvas, kit, spots);
	drawTrackFx(canvas, kit, t);
	canvas.restore();
	drawRunnerLabels(canvas, kit, spots);
	return recorder.finishRecordingAsPicture();
};
