import React from "react";

import Svg, { Defs, LinearGradient, Path, Polygon, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { FACE_H, FACE_SVG_STYLE, FACE_VIEWBOX, FACE_W, hole } from "./faceSvg";

const MASK =
	"M2 27 Q18 14 44 19 Q70 14 86 27 Q85 41 71 43 Q56 45 48 37 Q44 34 40 37 Q32 45 17 43 Q3 41 2 27 Z";

// Buddy Studio · máscara do raio (herói da velocidade, original do PACE TEAM)
export const Raio: React.FC = () => {
	const orange = useSvgId("pb-raio");

	return (
		<Svg viewBox={FACE_VIEWBOX} width={FACE_W} height={FACE_H} style={FACE_SVG_STYLE}>
			<Defs>
				<LinearGradient id={orange} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#FF9A5C" />
					<Stop offset="0.6" stopColor="#FD5A0C" />
					<Stop offset="1" stopColor="#CD3600" />
				</LinearGradient>
			</Defs>
			<Path
				d={`${MASK} ${hole(29, 30, 9, 10)} ${hole(59, 30, 9, 10)}`}
				fill={`url(#${orange})`}
				fillRule="evenodd"
				stroke="#8A2400"
				strokeWidth={1}
			/>
			<Polygon
				points="47,-2 35,12 42,12 37,24 53,8 46,8 51,-2"
				fill="#FFD23F"
				stroke="#9A6400"
				strokeWidth={1.2}
				strokeLinejoin="round"
			/>
		</Svg>
	);
};
