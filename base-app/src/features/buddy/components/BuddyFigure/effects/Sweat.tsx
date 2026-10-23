import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { anim } from "../../../animations";

import { ISpark } from "./shared";

const SWEAT: readonly ISpark[] = [
	[34, 30, 0],
	[104, 40, 0.9],
];
export const Sweat: React.FC = () => (
	<>
		{SWEAT.map(([x, y, d]) => (
			<Animated.View
				key={x}
				style={[
					{ position: "absolute", left: x, top: y, width: 7, height: 10, zIndex: 5 },
					anim("sweat", "1.8s", { timing: "ease-in", delay: `${String(d)}s` }),
				]}
			>
				<View
					style={{
						width: 7,
						height: 7,
						marginTop: 3,
						borderTopRightRadius: 4,
						borderBottomLeftRadius: 4,
						borderBottomRightRadius: 4,
						transform: [{ rotate: "45deg" }],
						backgroundColor: "#BFE3F8",
						boxShadow: "0 0 4px rgba(140,203,242,.8)",
					}}
				/>
			</Animated.View>
		))}
	</>
);
