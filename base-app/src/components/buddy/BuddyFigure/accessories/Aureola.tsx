import React from "react";

import Animated from "react-native-reanimated";

import { anim } from "../../animations";

import { abs } from "./shared";

export const Aureola: React.FC = () => (
	<Animated.View
		style={[
			abs({
				left: 17,
				top: -30,
				width: 54,
				height: 14,
				borderRadius: 27,
				borderWidth: 3,
				borderColor: "#FF9A5C",
				boxShadow: "0 0 12px #FD5A0C, inset 0 0 6px #FD5A0C",
			}),
			anim("halo", "2.4s"),
		]}
	/>
);
