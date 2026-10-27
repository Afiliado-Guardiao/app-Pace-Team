import React from "react";
import { ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { anim } from "../../animations";

import { ORANGE } from "./shared";

const arcStyle = (side: "l" | "r", isBig: boolean): ViewStyle => ({
	position: "absolute",
	top: isBig ? 42 : 50,
	left: side === "r" ? (isBig ? 128 : 120) : isBig ? -6 : 6,
	width: isBig ? 18 : 14,
	height: isBig ? 40 : 26,
	borderRadius: 20,
	borderWidth: 3,
	borderColor: "transparent",
	[side === "r" ? "borderRightColor" : "borderLeftColor"]: ORANGE,
	zIndex: 5,
});

export const ShakeArcs: React.FC = () => (
	<>
		{(["l", "r"] as const).flatMap((side) =>
			[false, true].map((isBig) => (
				<Animated.View
					key={side + String(isBig)}
					style={[
						arcStyle(side, isBig),
						anim("arc", "0.22s", { delay: isBig ? "0.11s" : "0s", direction: "alternate" }),
					]}
				/>
			)),
		)}
	</>
);
