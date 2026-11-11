import React from "react";

import Svg, { Circle, Ellipse, Path } from "react-native-svg";

import { FACE_H, FACE_SVG_STYLE, FACE_VIEWBOX, FACE_W } from "./faceSvg";

const INK = "#0B0E12";

// Buddy Studio · óculos de nariz grande, com sobrancelhas e bigode
export const Narigao: React.FC = () => (
	<Svg viewBox={FACE_VIEWBOX} width={FACE_W} height={FACE_H} style={FACE_SVG_STYLE}>
		<Path d="M17 14 Q29 7 40 14" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
		<Path d="M48 14 Q59 7 71 14" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
		<Circle cx={29} cy={30} r={11.5} stroke={INK} strokeWidth={3.5} fill="rgba(255,255,255,.14)" />
		<Circle cx={59} cy={30} r={11.5} stroke={INK} strokeWidth={3.5} fill="rgba(255,255,255,.14)" />
		<Path d="M40 28 Q44 25 48 28" stroke={INK} strokeWidth={3} fill="none" />
		<Path d="M17.5 30 L7 27" stroke={INK} strokeWidth={3} strokeLinecap="round" />
		<Path d="M70.5 30 L81 27" stroke={INK} strokeWidth={3} strokeLinecap="round" />
		<Ellipse cx={44} cy={42} rx={8.5} ry={10} fill="#F4A88A" stroke="#C9715A" strokeWidth={1.2} />
		<Ellipse cx={41} cy={38} rx={2.6} ry={3.2} fill="#fff" opacity={0.65} />
		<Path
			d="M26 54 Q33 45 44 50 Q55 45 62 54 Q53 52 44 56 Q35 52 26 54 Z"
			fill="#2A1A12"
			stroke="#140C08"
			strokeWidth={0.8}
		/>
	</Svg>
);
