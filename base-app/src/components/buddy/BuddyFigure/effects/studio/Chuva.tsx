import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { anim } from "../../../animations";

const DROPS = [48, 60, 72, 84] as const;

// Buddy Studio · nuvem de chuva só em cima do Buddy
export const Chuva: React.FC = () => (
	<View
		style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, zIndex: 6 }}
		pointerEvents="none"
	>
		<Animated.View
			style={[
				{ position: "absolute", left: 38, top: -22, width: 64, height: 28 },
				anim("halo", "2.4s"),
			]}
		>
			<Svg viewBox="0 0 64 28" width={64} height={28}>
				<Path
					d="M10 26 Q0 26 2 18 Q4 11 13 13 Q15 3 27 4 Q36 -2 44 7 Q56 5 58 15 Q66 17 62 24 Q60 26 56 26 Z"
					fill="#C9D3DE"
					stroke="#7290A8"
					strokeWidth={1}
				/>
			</Svg>
		</Animated.View>
		{DROPS.map((x, i) => (
			<Animated.View
				key={x}
				style={[
					{
						position: "absolute",
						left: x,
						top: 6,
						width: 4,
						height: 9,
						borderRadius: 3,
						backgroundColor: "#7FCBFF",
					},
					anim("rain", "0.9s", { delay: `${String(i * 0.22)}s`, timing: "linear" }),
				]}
			/>
		))}
	</View>
);
