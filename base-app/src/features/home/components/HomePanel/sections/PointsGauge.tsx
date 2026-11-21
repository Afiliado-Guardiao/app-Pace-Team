import React from "react";

import Svg, { Line, Polygon } from "react-native-svg";

import { ACRYLIC } from "../constants";

interface IPointsGaugeProps {
	width: number;
	lit: number;
}

export const GAUGE = { w: 300, h: 172, cx: 150, cy: 160, r: 132, len: 24, ticks: 54, stroke: 4.2 };
const NEEDLE = { base: 12, h: 16 };
const PAD = NEEDLE.h + 4;
// Altura / largura do medidor (com espaço para a agulha de cima)
export const GAUGE_RATIO = (GAUGE.h + PAD) / GAUGE.w;

const ticks = Array.from({ length: GAUGE.ticks }, (_, i) => {
	const a = Math.PI - (i * Math.PI) / (GAUGE.ticks - 1);
	const cos = Math.cos(a);
	const sin = Math.sin(a);
	const inner = GAUGE.r - GAUGE.len;
	return {
		x1: GAUGE.cx + inner * cos,
		y1: GAUGE.cy - inner * sin,
		x2: GAUGE.cx + GAUGE.r * cos,
		y2: GAUGE.cy - GAUGE.r * sin,
	};
});

// Agulha fixa no topo, como uma bússola: um triângulo acima do arco (para
// baixo) e outro abaixo dos tracinhos (para cima)
const top = GAUGE.cy - GAUGE.r - 3;
const low = GAUGE.cy - GAUGE.r + GAUGE.len + 3;
const half = NEEDLE.base / 2;
const NEEDLE_DOWN = `${String(GAUGE.cx - half)},${String(top - NEEDLE.h)} ${String(GAUGE.cx + half)},${String(top - NEEDLE.h)} ${String(GAUGE.cx)},${String(top)}`;
const NEEDLE_UP = `${String(GAUGE.cx - half)},${String(low + NEEDLE.h)} ${String(GAUGE.cx + half)},${String(low + NEEDLE.h)} ${String(GAUGE.cx)},${String(low)}`;

// Medidor de tracinhos em semicírculo: 54 traços que acendem até a fração
export const PointsGauge: React.FC<IPointsGaugeProps> = ({ width, lit }) => (
	<Svg
		width={width}
		height={width * GAUGE_RATIO}
		viewBox={`0 ${String(-PAD)} ${String(GAUGE.w)} ${String(GAUGE.h + PAD)}`}
	>
		{ticks.map((t, i) => (
			<Line
				key={i}
				{...t}
				stroke={i < lit ? "#fff" : ACRYLIC.tickOff}
				strokeWidth={GAUGE.stroke}
				strokeLinecap="butt"
			/>
		))}
		<Polygon points={NEEDLE_DOWN} fill="#fff" />
		<Polygon points={NEEDLE_UP} fill="#fff" />
	</Svg>
);
