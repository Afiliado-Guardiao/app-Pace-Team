import React from "react";

import Animated from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";

import { anim } from "../../../animations";

const BOLT = "12,0 2,15 9,15 5,28 20,10 12,10 17,0";
const BOLTS = [
	[2, 40],
	[118, 26],
	[112, 82],
] as const;

// Buddy Studio · raios piscando em volta
export const Raios: React.FC = () => (
	<>
		{BOLTS.map(([x, y], i) => (
			<Animated.View
				key={`${String(x)}-${String(y)}`}
				style={[
					{ position: "absolute", left: x, top: y, width: 20, height: 28, zIndex: 6 },
					anim("zap", "1.5s", { delay: `${String(i * 0.45)}s` }),
				]}
				pointerEvents="none"
			>
				<Svg viewBox="0 0 22 28" width={20} height={28}>
					<Polygon
						points={BOLT}
						fill="#FFE27A"
						stroke="#FFB547"
						strokeWidth={1.2}
						strokeLinejoin="round"
					/>
				</Svg>
			</Animated.View>
		))}
	</>
);
