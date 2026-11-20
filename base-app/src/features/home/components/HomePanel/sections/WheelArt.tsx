import React from "react";

import Svg, { Circle, Path } from "react-native-svg";

import { useTheme } from "@/theme";

interface IWheelArtProps {
	size: number;
}

const SLICES = 8;
// Raios em fração do raio total (os mesmos da roleta da equipe)
const OUTER_IN = 0.67;
const NAME_OUT = 0.65;
const NAME_IN = 0.33;

const point = (c: number, r: number, a: number): [number, number] => [
	c + r * Math.sin(a),
	c - r * Math.cos(a),
];

// Fatia de anel centrada no ângulo do índice i (0 = em cima)
const slice = (c: number, r0: number, r1: number, i: number): string => {
	const step = (2 * Math.PI) / SLICES;
	const a0 = (i - 0.5) * step;
	const a1 = (i + 0.5) * step;
	const [x0, y0] = point(c, r1, a0);
	const [x1, y1] = point(c, r1, a1);
	const [x2, y2] = point(c, r0, a1);
	const [x3, y3] = point(c, r0, a0);
	const f = (n: number): string => n.toFixed(2);
	return `M${f(x0)},${f(y0)} A${f(r1)},${f(r1)} 0 0 1 ${f(x1)},${f(y1)} L${f(x2)},${f(y2)} A${f(r0)},${f(r0)} 0 0 0 ${f(x3)},${f(y3)} Z`;
};

const SLOTS = Array.from({ length: SLICES }, (_, i) => i);

// Ilustração da roleta dupla da equipe: anel dos desafios (de fora) e o dos
// nomes (de dentro), com uma casa laranja como a sorteada
export const WheelArt: React.FC<IWheelArtProps> = ({ size }) => {
	const { theme } = useTheme();
	const { colors } = theme.pace;
	const c = size / 2;
	const r1 = c - 1;

	return (
		<Svg width={size} height={size}>
			{SLOTS.map((i) => (
				<Path
					key={`o${String(i)}`}
					d={slice(c, r1 * OUTER_IN, r1, i)}
					fill={i === 0 ? colors.accent : i % 2 ? colors.textSecondary : colors.glassLight}
					stroke={colors.bgSunken}
					strokeWidth={1}
				/>
			))}
			{SLOTS.map((i) => (
				<Path
					key={`n${String(i)}`}
					d={slice(c, r1 * NAME_IN, r1 * NAME_OUT, i + 0.5)}
					fill={i % 2 ? colors.glassDark : colors.bgElevated}
					stroke={colors.bgSunken}
					strokeWidth={1}
				/>
			))}
			<Circle cx={c} cy={c} r={r1 * NAME_IN} fill={colors.bgElevated} />
		</Svg>
	);
};
