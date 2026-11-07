import {
	BlendMode,
	SkCanvas,
	Skia,
	SkImage,
	SkPicture,
	TileMode,
} from "@shopify/react-native-skia";

import { IWeather } from "@/lib/weather";

import { rgba } from "./color";
import { BUDDY_RECT, IRect, SCENE_H, SCENE_W, TRACK_RECT } from "./geometry";
import { toneMatrix } from "./tone";

const skRect = (r: IRect) => Skia.XYWHRect(r.x, r.y, r.w, r.h);
const EDGE = 1.5;

export const trackSrc = (track: SkImage) => Skia.XYWHRect(0, 0, track.width(), track.height());

// Pintura com o tom do clima (pista e corredores)
export const makeTonePaint = (weather: IWeather) => {
	const paint = Skia.Paint();
	paint.setColorFilter(Skia.ColorFilter.MakeMatrix(toneMatrix(weather.preset)));
	return paint;
};

// Tinta do clima por cima da pista (só onde tem pista: recorte pelo alfa)
const drawTint = (canvas: SkCanvas, weather: IWeather): void => {
	const r = TRACK_RECT;
	const paint = Skia.Paint();
	const { preset } = weather;
	if (preset === "night") {
		paint.setBlendMode(BlendMode.Multiply);
		paint.setShader(
			Skia.Shader.MakeLinearGradient(
				{ x: 0, y: r.y },
				{ x: 0, y: r.y + r.h },
				[Skia.Color("rgba(60,85,150,0.3)"), Skia.Color("rgba(30,45,90,0.22)")],
				null,
				TileMode.Clamp,
			),
		);
	} else if (preset === "rain" || preset === "storm" || preset === "cloudy") {
		paint.setBlendMode(BlendMode.Multiply);
		paint.setColor(rgba(70, 85, 105, preset === "cloudy" ? 0.14 : 0.2 + 0.2 * weather.rain));
	} else if (preset === "cold") {
		paint.setBlendMode(BlendMode.Screen);
		paint.setColor(Skia.Color("rgba(170,210,255,0.28)"));
	} else {
		paint.setBlendMode(BlendMode.Screen);
		paint.setShader(
			Skia.Shader.MakeRadialGradient(
				{ x: r.x + r.w, y: r.y - r.h * 0.2 },
				r.w * 0.85,
				[rgba(255, 200, 130, 0.2 + 0.55 * weather.sun), Skia.Color("rgba(255,200,130,0)")],
				null,
				TileMode.Clamp,
			),
		);
	}
	// Um pouco para dentro: a borda suavizada do retângulo não escapa do recorte
	const inner = { x: r.x + EDGE, y: r.y + EDGE, w: r.w - EDGE * 2, h: r.h - EDGE * 2 };
	canvas.drawRect(skRect(inner), paint);
};

// Sombra escura no chão, embaixo do Buddy
const drawBuddyShadow = (canvas: SkCanvas): void => {
	const b = BUDDY_RECT;
	const paint = Skia.Paint();
	paint.setColor(Skia.Color("rgba(0,0,0,0.42)"));
	paint.setMaskFilter(Skia.MaskFilter.MakeBlur(0, 7, true));
	canvas.drawOval(Skia.XYWHRect(b.x + b.w * 0.06, b.y + b.h - 26, b.w * 0.86, 22), paint);
};

// Parte parada da cena (muda só com o clima): pista com tom e tinta + sombra
export const makeBasePicture = (track: SkImage, weather: IWeather): SkPicture => {
	const recorder = Skia.PictureRecorder();
	const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, SCENE_W, SCENE_H));
	canvas.saveLayer();
	canvas.drawImageRect(track, trackSrc(track), skRect(TRACK_RECT), makeTonePaint(weather));
	drawTint(canvas, weather);
	const mask = Skia.Paint();
	mask.setBlendMode(BlendMode.DstIn);
	canvas.drawImageRect(track, trackSrc(track), skRect(TRACK_RECT), mask);
	canvas.restore();
	drawBuddyShadow(canvas);
	return recorder.finishRecordingAsPicture();
};
