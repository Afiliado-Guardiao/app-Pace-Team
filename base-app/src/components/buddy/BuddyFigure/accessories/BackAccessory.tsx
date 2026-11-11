import React from "react";
import { ViewStyle } from "react-native";

import Animated from "react-native-reanimated";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { anim } from "../../animations";

import { roundRect } from "./faceSvg";

interface IBackAccessoryProps {
	id: "paraquedas" | "espadas";
	isMini: boolean;
}

// Coordenadas da figura inteira (140 × 135), atrás do corpo
const BOX: ViewStyle = {
	position: "absolute",
	left: 0,
	top: -56,
	width: 140,
	height: 180,
	zIndex: 1,
	transformOrigin: "50% 70%",
};
const VIEWBOX = "0 -56 140 180";
const STRING = "rgba(255,255,255,.75)";

// Buddy Studio · paraquedas listrado em cima do Buddy, com as cordas
const Paraquedas: React.FC = () => {
	const canopy = useSvgId("pb-chute");
	return (
		<Svg viewBox={VIEWBOX} width={140} height={180}>
			<Defs>
				<LinearGradient id={canopy} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#FF9A5C" />
					<Stop offset="1" stopColor="#E84A00" />
				</LinearGradient>
			</Defs>
			<Line x1={10} y1={-6} x2={34} y2={62} stroke={STRING} strokeWidth={1} />
			<Line x1={38} y1={-6} x2={46} y2={40} stroke={STRING} strokeWidth={1} />
			<Line x1={102} y1={-6} x2={94} y2={40} stroke={STRING} strokeWidth={1} />
			<Line x1={130} y1={-6} x2={106} y2={62} stroke={STRING} strokeWidth={1} />
			<Path
				d="M8 -4 Q70 -66 132 -4 Q118 -13 104 -4 Q87 -15 70 -4 Q53 -15 36 -4 Q22 -13 8 -4 Z"
				fill={`url(#${canopy})`}
				stroke="#CD3600"
				strokeWidth={1}
			/>
			<Path d="M36 -4 Q38 -38 58 -55 Q49 -30 53 -9 Q45 -13 36 -4 Z" fill="#F4F6F8" />
			<Path d="M104 -4 Q102 -38 82 -55 Q91 -30 87 -9 Q95 -13 104 -4 Z" fill="#F4F6F8" />
		</Svg>
	);
};

// Buddy Studio · duas espadas de samurai cruzadas nas costas
const Espadas: React.FC = () => {
	const blade = useSvgId("pb-blade");
	return (
		<Svg viewBox={VIEWBOX} width={140} height={180}>
			<Defs>
				<LinearGradient id={blade} x1="0" y1="0" x2="1" y2="1">
					<Stop offset="0" stopColor="#FFFFFF" />
					<Stop offset="1" stopColor="#9FAAB5" />
				</LinearGradient>
			</Defs>
			<Path
				d="M34 28 L112 112 L108 116 L30 32 Z"
				fill={`url(#${blade})`}
				stroke="#6C7885"
				strokeWidth={0.8}
			/>
			<Path
				d="M106 28 L28 112 L32 116 L110 32 Z"
				fill={`url(#${blade})`}
				stroke="#6C7885"
				strokeWidth={0.8}
			/>
			<Path d={roundRect(14, 4, 9, 30, 3)} fill="#1B2733" transform="rotate(-43 18 19)" />
			<Path d={roundRect(117, 4, 9, 30, 3)} fill="#1B2733" transform="rotate(43 122 19)" />
			<Path d="M14 10 L24 18 M11 16 L21 24 M17 4 L27 12" stroke="#FD5A0C" strokeWidth={1.4} />
			<Path d="M126 10 L116 18 M129 16 L119 24 M123 4 L113 12" stroke="#FD5A0C" strokeWidth={1.4} />
			<Circle cx={31} cy={30} r={5} fill="#FFD45C" stroke="#9A6410" strokeWidth={1} />
			<Circle cx={109} cy={30} r={5} fill="#FFD45C" stroke="#9A6410" strokeWidth={1} />
		</Svg>
	);
};

// Acessórios de costas do Buddy Studio (atrás do corpo, como a capa)
export const BackAccessory: React.FC<IBackAccessoryProps> = ({ id, isMini }) => (
	<Animated.View
		style={[BOX, isMini || id !== "paraquedas" ? null : anim("q", "2.6s")]}
		pointerEvents="none"
	>
		{id === "paraquedas" ? <Paraquedas /> : <Espadas />}
	</Animated.View>
);
