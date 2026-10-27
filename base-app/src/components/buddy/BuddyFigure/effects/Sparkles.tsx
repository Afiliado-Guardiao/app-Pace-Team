import React from "react";

import Animated from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";

import { anim } from "../../animations";

import { ISpark, STAR } from "./shared";

export const Sparkles: React.FC<{
	list: readonly ISpark[];
	colors: readonly [string, string];
	duration: string;
	step: number;
	glow?: string;
}> = ({ list, colors, duration, step, glow }) => (
	<>
		{list.map(([x, y, s], i) => (
			<Animated.View
				key={`${String(x)}-${String(y)}`}
				style={[
					{
						position: "absolute",
						left: x,
						top: y,
						width: s,
						height: s,
						zIndex: 5,
						boxShadow: glow ? `0 0 4px ${glow}` : undefined,
					},
					anim("spark", duration, { delay: `${String(i * step)}s` }),
				]}
			>
				<Svg width={s} height={s} viewBox="0 0 100 100">
					<Polygon points={STAR} fill={i % 2 ? "#FFFFFF" : colors[0]} />
				</Svg>
			</Animated.View>
		))}
	</>
);
