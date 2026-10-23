import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { anim } from "../../../animations";

import { ORANGE } from "./shared";

const RAY_ANGLES = [-60, -30, 30, 60, -110, 110] as const;
export const Rays: React.FC = () => (
	<View
		style={{ position: "absolute", left: 70, top: 66, width: 0, height: 0, zIndex: 5 }}
		pointerEvents="none"
	>
		{RAY_ANGLES.map((d, i) => (
			<View
				key={d}
				style={{
					position: "absolute",
					left: -1.5,
					top: 0,
					width: 3,
					height: 0,
					transform: [{ rotate: `${String(d)}deg` }],
				}}
			>
				<Animated.View
					style={[
						{
							position: "absolute",
							left: 0,
							top: -74,
							width: 3,
							height: 12,
							borderRadius: 2,
							backgroundColor: ORANGE,
							boxShadow: "0 0 6px #FD5A0C",
						},
						anim("ray", "0.35s", { delay: `${String(i * 0.06)}s`, direction: "alternate" }),
					]}
				/>
			</View>
		))}
	</View>
);
