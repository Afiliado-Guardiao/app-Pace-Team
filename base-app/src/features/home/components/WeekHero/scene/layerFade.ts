import { BlendMode, SkCanvas, Skia, TileMode } from "@shopify/react-native-skia";

import { rgba } from "./color";

const TOP_FADE = 70;
const BOTTOM_FADE = 150;

// Some aos poucos no topo (70) e embaixo (150): camadas sem borda visível.
// Fecha o saveLayer aberto antes de desenhar a camada.
export const fadeLayerEdges = (canvas: SkCanvas, size: { width: number; height: number }): void => {
	"worklet";
	const { width, height } = size;
	const mask = Skia.Paint();
	mask.setBlendMode(BlendMode.DstIn);
	const top = Math.min(TOP_FADE / height, 0.4);
	const bottom = Math.max(1 - BOTTOM_FADE / height, 0.6);
	const clear = rgba(0, 0, 0, 0);
	const solid = rgba(0, 0, 0, 1);
	mask.setShader(
		Skia.Shader.MakeLinearGradient(
			{ x: 0, y: 0 },
			{ x: 0, y: height },
			[clear, solid, solid, clear],
			[0, top, bottom, 1],
			TileMode.Clamp,
		),
	);
	canvas.drawRect(Skia.XYWHRect(0, 0, width, height), mask);
	canvas.restore();
};
