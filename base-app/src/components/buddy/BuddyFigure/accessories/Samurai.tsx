import React from "react";

import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { FACE_H, FACE_SVG_STYLE, FACE_VIEWBOX, FACE_W, roundRect } from "./faceSvg";

const GOLD = "#FFD45C";
const GOLD_DARK = "#9A6410";
const INK = "#140C08";

// Buddy Studio · máscara de samurai: crista dourada, faixa e máscara vermelha
export const Samurai: React.FC = () => {
	const red = useSvgId("pb-samurai");
	const gold = useSvgId("pb-samurai-gold");

	return (
		<Svg viewBox={FACE_VIEWBOX} width={FACE_W} height={FACE_H} style={FACE_SVG_STYLE}>
			<Defs>
				<LinearGradient id={red} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#C8321F" />
					<Stop offset="1" stopColor="#6E120B" />
				</LinearGradient>
				<LinearGradient id={gold} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#FFF1B8" />
					<Stop offset="0.5" stopColor={GOLD} />
					<Stop offset="1" stopColor="#C98A0B" />
				</LinearGradient>
			</Defs>
			<Path
				d="M44 6 Q26 -2 20 -26 Q33 -12 44 -3 Q55 -12 68 -26 Q62 -2 44 6 Z"
				fill={`url(#${gold})`}
				stroke={GOLD_DARK}
				strokeWidth={1}
			/>
			<Path d={roundRect(4, 3, 80, 10, 5)} fill="#2A1E1A" stroke={GOLD} strokeWidth={1} />
			<Circle cx={44} cy={8} r={3.2} fill={GOLD} stroke={GOLD_DARK} strokeWidth={0.8} />
			<Path
				d="M6 39 Q44 33 82 39 L78 57 Q44 74 10 57 Z"
				fill={`url(#${red})`}
				stroke={GOLD}
				strokeWidth={1.4}
			/>
			<Path
				d="M24 46 Q30 43 38 46"
				stroke={INK}
				strokeWidth={2.4}
				strokeLinecap="round"
				fill="none"
			/>
			<Path
				d="M50 46 Q58 43 64 46"
				stroke={INK}
				strokeWidth={2.4}
				strokeLinecap="round"
				fill="none"
			/>
			<Path
				d="M34 53 Q44 58 54 53"
				stroke={INK}
				strokeWidth={2.2}
				strokeLinecap="round"
				fill="none"
			/>
			<Path d="M14 52 L22 55 M74 52 L66 55" stroke={GOLD} strokeWidth={1.2} strokeLinecap="round" />
		</Svg>
	);
};
