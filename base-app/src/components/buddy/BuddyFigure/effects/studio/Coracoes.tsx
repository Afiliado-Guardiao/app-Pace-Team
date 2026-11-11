import React from "react";

import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { anim } from "../../../animations";

const HEART = "M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z";
const HEARTS = [
	[10, 40, 16, "#FF4D6D"],
	[112, 26, 13, "#FF7A9C"],
	[104, 70, 11, "#FF4D6D"],
] as const;

// Buddy Studio · corações subindo em volta do Buddy
export const Coracoes: React.FC = () => (
	<>
		{HEARTS.map(([x, y, s, color], i) => (
			<Animated.View
				key={`${String(x)}-${String(y)}`}
				style={[
					{ position: "absolute", left: x, top: y, width: s, height: s, zIndex: 6 },
					anim("rise", "2.2s", { delay: `${String(i * 0.7)}s`, timing: "ease-out" }),
				]}
				pointerEvents="none"
			>
				<Svg viewBox="0 0 24 24" width={s} height={s}>
					<Path d={HEART} fill={color} />
				</Svg>
			</Animated.View>
		))}
	</>
);
