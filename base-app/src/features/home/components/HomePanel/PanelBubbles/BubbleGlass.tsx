import React from "react";

import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { LENS } from "../constants";

const S = LENS.sizes[0];
const FILL = { position: "absolute", left: 0, top: 0 } as const;

// Vidro fumê da bolinha: reflexo de baixo, luz de cima e o brilho especular
export const BubbleGlass: React.FC = () => {
	const id = useSvgId("hp-bubble");
	return (
		<Svg width={S} height={S} style={FILL}>
			<Defs>
				<RadialGradient id={`${id}l`} cx="0.3" cy="0.18" rx="1" ry="1" fx="0.3" fy="0.18">
					<Stop offset="0" stopColor="#fff" stopOpacity={0.3} />
					<Stop offset="0.42" stopColor="#fff" stopOpacity={0.06} />
					<Stop offset="1" stopColor="rgb(40,44,40)" stopOpacity={0.28} />
				</RadialGradient>
				<RadialGradient id={`${id}b`} cx="0.5" cy="1.05" rx="1.2" ry="0.9" fx="0.5" fy="1.05">
					<Stop offset="0" stopColor="#fff" stopOpacity={0.16} />
					<Stop offset="0.55" stopColor="#fff" stopOpacity={0} />
				</RadialGradient>
				<LinearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#fff" stopOpacity={0.55} />
					<Stop offset="1" stopColor="#fff" stopOpacity={0} />
				</LinearGradient>
			</Defs>
			<Rect width={S} height={S} fill={`url(#${id}l)`} />
			<Rect width={S} height={S} fill={`url(#${id}b)`} />
			<Ellipse
				cx={S / 2}
				cy={S * (0.06 + 0.19)}
				rx={S * 0.32}
				ry={S * 0.19}
				fill={`url(#${id}s)`}
				opacity={0.55}
			/>
		</Svg>
	);
};
