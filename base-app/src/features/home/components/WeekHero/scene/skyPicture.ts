import { SkCanvas, Skia, SkPicture, TileMode } from "@shopify/react-native-skia";

import { IWeather } from "@/lib/weather";

import { rgba } from "./color";
import { hash } from "./geometry";
import { fadeLayerEdges } from "./layerFade";
import { IHeroFrame } from "./types";

const STARS = 140;
const STARS_AREA = 0.62;
const SHOOTING_EVERY_S = 5;
const SHOOTING_LIFE_S = 0.9;

// Sol: luz vinda de fora da tela, pela direita, alongada na direção da pista
const drawSun = (canvas: SkCanvas, o: { frame: IHeroFrame; sun: number }, t: number): void => {
	"worklet";
	const { frame, sun } = o;
	const cx = frame.width + 24;
	const cy = frame.height * 0.22;
	const radius = Math.hypot(frame.width, frame.height) * (0.55 + 0.3 * sun);
	const breath = 1 + Math.sin(t * 0.8) * 0.03;
	const toTrack = Math.atan2(frame.blockBottom - cy, frame.width * 0.35 - cx);
	const stop = rgba;
	const paint = Skia.Paint();
	paint.setShader(
		Skia.Shader.MakeRadialGradient(
			{ x: 0, y: 0 },
			radius,
			[
				stop(255, 236, 180, 0.35 + 0.3 * sun),
				stop(255, 212, 140, 0.26 + 0.24 * sun),
				stop(255, 180, 105, 0.14 + 0.18 * sun),
				stop(255, 160, 90, 0.04 + 0.07 * sun),
				stop(255, 160, 90, 0),
			],
			[0, 0.12, 0.35, 0.65, 1],
			TileMode.Clamp,
		),
	);
	canvas.save();
	canvas.translate(cx, cy);
	canvas.rotate((toTrack * 180) / Math.PI, 0, 0);
	canvas.scale(1.45 * breath, 0.9 * breath);
	canvas.drawCircle(0, 0, radius, paint);
	canvas.restore();
};

const drawShootingStar = (canvas: SkCanvas, frame: IHeroFrame, t: number): void => {
	"worklet";
	const n = Math.floor(t / SHOOTING_EVERY_S);
	const age = t - n * SHOOTING_EVERY_S;
	if (age > SHOOTING_LIFE_S) return;
	const f = age / SHOOTING_LIFE_S;
	const x0 = frame.width * (0.35 + hash(n * 3.1) * 0.6);
	const y0 = frame.height * STARS_AREA * hash(n * 5.7) * 0.5;
	const x = x0 - f * 160;
	const y = y0 + f * 70;
	const paint = Skia.Paint();
	paint.setStyle(1);
	paint.setStrokeCap(1);
	paint.setStrokeWidth(1.4);
	paint.setShader(
		Skia.Shader.MakeLinearGradient(
			{ x, y },
			{ x: x + 60, y: y - 26 },
			[rgba(255, 255, 255, 0.9 * (1 - f)), rgba(255, 255, 255, 0)],
			null,
			TileMode.Clamp,
		),
	);
	canvas.drawLine(x, y, x + 60, y - 26, paint);
};

const drawStars = (canvas: SkCanvas, frame: IHeroFrame, t: number): void => {
	"worklet";
	const paint = Skia.Paint();
	paint.setColor(rgba(255, 255, 255, 1));
	for (let i = 0; i < STARS; i++) {
		const x = hash(i * 1.71) * frame.width;
		const y = hash(i * 2.93) * frame.height * STARS_AREA;
		const r = 0.6 + hash(i * 4.07) * 1.6;
		paint.setAlphaf(0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * (1 + hash(i) * 2.2) + i)));
		canvas.drawCircle(x, y, r, paint);
	}
	drawShootingStar(canvas, frame, t);
};

// Céu atrás de todo o conteúdo: sol de dia, estrelas à noite
export const skyPicture = (o: { frame: IHeroFrame; weather: IWeather }, t: number): SkPicture => {
	"worklet";
	const { frame, weather } = o;
	const recorder = Skia.PictureRecorder();
	const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, frame.width, frame.height));
	canvas.saveLayer();
	if (weather.preset === "night") drawStars(canvas, frame, t);
	if (weather.sun > 0) drawSun(canvas, { frame, sun: weather.sun }, t);
	fadeLayerEdges(canvas, frame);
	return recorder.finishRecordingAsPicture();
};

// O céu só se mexe com sol ou estrelas
export const skyIsAnimated = (weather: IWeather): boolean =>
	weather.preset === "night" || weather.sun > 0;
