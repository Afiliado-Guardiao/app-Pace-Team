import React from "react";

import Svg, { Path, Polygon } from "react-native-svg";

import { FACE_H, FACE_SVG_STYLE, FACE_VIEWBOX, FACE_W } from "./faceSvg";

const TOOTH = "#FFFFFF";
const EDGE = "#9FAAB5";

// Buddy Studio · dentes de vampiro: boca aberta com dois caninos compridos
export const Vampiro: React.FC = () => (
	<Svg viewBox={FACE_VIEWBOX} width={FACE_W} height={FACE_H} style={FACE_SVG_STYLE}>
		<Path
			d="M31 45 Q44 47 57 45 Q55 58 44 59 Q33 58 31 45 Z"
			fill="#5A0A12"
			stroke="#2A0508"
			strokeWidth={1}
		/>
		<Path
			d="M31 45 Q44 47 57 45 L56 49 Q44 51 32 49 Z"
			fill={TOOTH}
			stroke={EDGE}
			strokeWidth={0.6}
		/>
		<Polygon
			points="35,47 39.5,48 37,57"
			fill={TOOTH}
			stroke={EDGE}
			strokeWidth={0.8}
			strokeLinejoin="round"
		/>
		<Polygon
			points="48.5,48 53,47 51,57"
			fill={TOOTH}
			stroke={EDGE}
			strokeWidth={0.8}
			strokeLinejoin="round"
		/>
		<Path
			d="M40 54 Q44 56 48 54"
			stroke="#FF4D6D"
			strokeWidth={1.6}
			strokeLinecap="round"
			fill="none"
		/>
	</Svg>
);
