import { SkCanvas, Skia } from "@shopify/react-native-skia";

import { rgba } from "./color";
import { hash, pointAt, TRACK_PATH } from "./geometry";
import { IHeroFrame, ISceneKit } from "./types";

const FALL_PART = 0.82;
const FOG_COUNT = 16;

// Chuva: cada gota cai do topo da tela até um ponto da pista e vira respingo
export const drawRain = (
	canvas: SkCanvas,
	o: { kit: ISceneKit; frame: IHeroFrame },
	t: number,
): void => {
	"worklet";
	const { kit, frame } = o;
	const rain = kit.weather.rain;
	const count = Math.round(70 + 230 * rain);
	const drop = Skia.Paint();
	drop.setStyle(1);
	drop.setStrokeCap(1);
	drop.setStrokeWidth(1 + 0.9 * rain);
	drop.setColor(rgba(205, 222, 255, 0.5));
	const splash = Skia.Paint();
	splash.setStyle(1);
	splash.setStrokeWidth(0.9);
	const len = 12 + 16 * rain;
	const slant = 0.04 + 0.08 * rain;
	for (let i = 0; i < count; i++) {
		const period = (0.62 + hash(i * 1.3) * 0.35) * (1 - 0.25 * rain);
		const run = (t + hash(i * 7.1) * period) / period;
		const cycle = Math.floor(run);
		const f = run - cycle;
		const p = pointAt(TRACK_PATH, hash(i * 13.7 + cycle * 0.618));
		const jitter = (hash(i + cycle * 3.3) - 0.5) * 18;
		const tx = frame.sceneX + (p.x + jitter) * kit.ks;
		const ty = frame.sceneY + (p.y + jitter * 0.3) * kit.ks;
		if (f < FALL_PART) {
			const k = f / FALL_PART;
			const y = ty * k;
			const x = tx + (ty - y) * slant;
			canvas.drawLine(x + len * slant, y - len, x, y, drop);
		} else {
			const s = (f - FALL_PART) / (1 - FALL_PART);
			const rx = (2 + 5 * s) * kit.k;
			splash.setColor(rgba(215, 230, 255, 0.55 * (1 - s)));
			canvas.drawOval(Skia.XYWHRect(tx - rx, ty - rx * 0.38, rx * 2, rx * 0.76), splash);
		}
	}
};

// Névoa do frio: manchas que nascem perto da pista, sobem e vão para os lados
export const drawFog = (
	canvas: SkCanvas,
	o: { kit: ISceneKit; frame: IHeroFrame },
	t: number,
): void => {
	"worklet";
	const { kit, frame } = o;
	const paint = Skia.Paint();
	paint.setColor(rgba(230, 240, 255, 1));
	paint.setMaskFilter(Skia.MaskFilter.MakeBlur(0, 26 * kit.k, true));
	const startY = frame.sceneY + 330 * kit.ks;
	for (let i = 0; i < FOG_COUNT; i++) {
		const period = 14 + hash(i * 2.9) * 9;
		const f = ((t + hash(i * 5.3) * period) / period) % 1;
		const side = hash(i * 8.1) > 0.5 ? 1 : -1;
		const x0 = frame.sceneX + hash(i * 4.4) * 600 * kit.ks;
		const x = x0 + side * f * 90 * kit.k + Math.sin(t * 0.4 + i) * 14 * kit.k;
		const y = startY - f * startY;
		paint.setAlphaf((0.1 + hash(i * 6.6) * 0.06) * Math.sin(Math.PI * f));
		canvas.drawCircle(x, y, (40 + hash(i * 9.2) * 40) * kit.k, paint);
	}
};
