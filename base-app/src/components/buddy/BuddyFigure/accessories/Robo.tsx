import React from "react";

import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { FACE_H, FACE_SVG_STYLE, FACE_VIEWBOX, FACE_W, roundRect } from "./faceSvg";

const EDGE = "#4F5B67";

// Buddy Studio · capacete de robô: metal, antena e visor que brilha
export const Robo: React.FC = () => {
	const metal = useSvgId("pb-robo");
	const fill = `url(#${metal})`;

	return (
		<Svg viewBox={FACE_VIEWBOX} width={FACE_W} height={FACE_H} style={FACE_SVG_STYLE}>
			<Defs>
				<LinearGradient id={metal} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#F4F7FA" />
					<Stop offset="0.45" stopColor="#B7C3CF" />
					<Stop offset="1" stopColor="#5F6B78" />
				</LinearGradient>
			</Defs>
			<Line x1={44} y1={-9} x2={44} y2={-22} stroke="#7C8896" strokeWidth={2.6} />
			<Circle cx={44} cy={-25} r={4.5} fill="#FD5A0C" stroke="#CD3600" strokeWidth={1} />
			<Path
				d="M-3 36 Q-4 -9 44 -10 Q92 -9 91 36 L83 36 Q83 3 44 2 Q5 3 5 36 Z"
				fill={fill}
				stroke={EDGE}
				strokeWidth={1}
			/>
			<Path d={roundRect(3, 19, 82, 20, 10)} fill="#0B1520" stroke="#9FAAB5" strokeWidth={1.4} />
			<Path d={roundRect(8, 23, 72, 12, 6)} fill="rgba(77,232,255,.25)" />
			<Path d={roundRect(13, 26, 62, 6, 3)} fill="#4DE8FF" />
			<Circle cx={-4} cy={29} r={6.5} fill={fill} stroke={EDGE} strokeWidth={1} />
			<Circle cx={92} cy={29} r={6.5} fill={fill} stroke={EDGE} strokeWidth={1} />
			<Circle cx={-4} cy={29} r={2.4} fill="#FD5A0C" />
			<Circle cx={92} cy={29} r={2.4} fill="#FD5A0C" />
		</Svg>
	);
};
