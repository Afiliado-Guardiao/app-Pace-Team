import React from "react";

import Svg, { Path } from "react-native-svg";

import { FACE_H, FACE_SVG_STYLE, FACE_VIEWBOX, FACE_W } from "./faceSvg";

const NAVY = "#1B2733";
const INK = "#0B0E12";
const WEB = "rgba(253,122,30,.9)";
const MASK =
	"M3 26 Q18 13 44 20 Q70 13 85 26 Q84 41 70 43 Q55 45 48 36 Q44 33 40 36 Q33 45 18 43 Q4 41 3 26 Z";
const WEB_LINES =
	"M44 21 L44 34 M44 27 L8 22 M44 27 L80 22 M44 27 L6 36 M44 27 L82 36 M20 18 Q22 26 14 34 M68 18 Q66 26 74 34 M32 16 Q33 26 24 40 M56 16 Q55 26 64 40";

// Buddy Studio · máscara de herói-teia (original do PACE TEAM): máscara
// azul-marinho nos olhos, teia laranja e lentes brancas
export const Heroi: React.FC = () => (
	<Svg viewBox={FACE_VIEWBOX} width={FACE_W} height={FACE_H} style={FACE_SVG_STYLE}>
		<Path d={MASK} fill={NAVY} stroke={INK} strokeWidth={1} />
		<Path d={WEB_LINES} stroke={WEB} strokeWidth={0.9} fill="none" />
		<Path
			d="M19 25 Q29 19 37 27 Q36 37 27 37 Q19 34 19 25 Z"
			fill="#F4F6F8"
			stroke={INK}
			strokeWidth={1.6}
		/>
		<Path
			d="M69 25 Q59 19 51 27 Q52 37 61 37 Q69 34 69 25 Z"
			fill="#F4F6F8"
			stroke={INK}
			strokeWidth={1.6}
		/>
	</Svg>
);
