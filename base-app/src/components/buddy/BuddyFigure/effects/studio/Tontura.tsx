import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";

import { anim } from "../../../animations";
import { STAR } from "../shared";

const ORBIT = 66;
const SIZE = 13;
// Quatro estrelinhas no círculo (cima, direita, baixo, esquerda)
const SPOTS = [
	[ORBIT / 2 - SIZE / 2, -SIZE / 2],
	[ORBIT - SIZE / 2, ORBIT / 2 - SIZE / 2],
	[ORBIT / 2 - SIZE / 2, ORBIT - SIZE / 2],
	[-SIZE / 2, ORBIT / 2 - SIZE / 2],
] as const;
const COLORS = ["#FFD23F", "#FFFFFF", "#FF9A5C", "#FFD23F"] as const;

// Buddy Studio · tontura: estrelinhas girando em cima da cabeça
export const Tontura: React.FC = () => (
	<View
		style={{
			position: "absolute",
			left: 70 - ORBIT / 2,
			top: 22 - ORBIT / 2,
			width: ORBIT,
			height: ORBIT,
			zIndex: 6,
			transform: [{ scaleY: 0.34 }],
		}}
		pointerEvents="none"
	>
		<Animated.View
			style={[
				{ position: "absolute", left: 0, top: 0, width: ORBIT, height: ORBIT },
				anim("spin", "1.4s", { timing: "linear" }),
			]}
		>
			{SPOTS.map(([x, y], i) => (
				<Svg
					key={`${String(x)}-${String(y)}`}
					viewBox="0 0 100 100"
					width={SIZE}
					height={SIZE * 2.6}
					style={{ position: "absolute", left: x, top: y - SIZE * 0.8 }}
				>
					<Polygon points={STAR} fill={COLORS[i]} />
				</Svg>
			))}
		</Animated.View>
	</View>
);
