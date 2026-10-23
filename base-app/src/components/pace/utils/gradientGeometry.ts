import { IGradientLayer } from "@/theme";

export interface ILinearGeometry {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export interface IRadialGeometry {
	cx: number;
	cy: number;
	rx: number;
	ry: number;
}

const DEG_TO_RAD = Math.PI / 180;

// Mesma geometria do linear-gradient(<ângulo>) do CSS: a linha passa pelo
// centro e tem o comprimento que alcança os cantos da caixa.
export const linearGeometry = (angle: number, width: number, height: number): ILinearGeometry => {
	const rad = angle * DEG_TO_RAD;
	const dx = Math.sin(rad);
	const dy = -Math.cos(rad);
	const half = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
	const cx = width / 2;
	const cy = height / 2;

	return { x1: cx - dx * half, y1: cy - dy * half, x2: cx + dx * half, y2: cy + dy * half };
};

// radial-gradient(<rx%> <ry%> at <cx%> <cy%>) em coordenadas absolutas.
export const radialGeometry = (
	layer: Extract<IGradientLayer, { type: "radial" }>,
	width: number,
	height: number,
): IRadialGeometry => ({
	cx: layer.cx * width,
	cy: layer.cy * height,
	rx: layer.rx * width,
	ry: layer.ry * height,
});
