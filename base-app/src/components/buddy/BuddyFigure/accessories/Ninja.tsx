import React from "react";

import Svg, { Path } from "react-native-svg";

import { FACE_H, FACE_SVG_STYLE, FACE_VIEWBOX, FACE_W, roundRect } from "./faceSvg";

const CLOTH = "#1B2733";
const FOLD = "#2D3E4F";

// Buddy Studio · máscara de ninja: capuz, pano no rosto e faixa laranja
export const Ninja: React.FC = () => (
	<Svg viewBox={FACE_VIEWBOX} width={FACE_W} height={FACE_H} style={FACE_SVG_STYLE}>
		<Path d="M-1 22 Q-1 -6 44 -6 Q89 -6 89 22 Q44 15 -1 22 Z" fill={CLOTH} />
		<Path d="M-1 38 Q44 45 89 38 L89 52 Q87 72 44 73 Q1 72 -1 52 Z" fill={CLOTH} />
		<Path d="M10 50 Q44 56 78 50 M16 60 Q44 66 72 60" stroke={FOLD} strokeWidth={1.4} fill="none" />
		<Path d={roundRect(-2, 10, 92, 7, 3)} fill="#FD5A0C" />
		<Path d="M86 13 Q98 10 104 18 Q97 17 92 16 Z" fill="#E84A00" />
		<Path d="M86 15 Q97 20 99 30 Q93 24 88 19 Z" fill="#CD3600" />
	</Svg>
);
