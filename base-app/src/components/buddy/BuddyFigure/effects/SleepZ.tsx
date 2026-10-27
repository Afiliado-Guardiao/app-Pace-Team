import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { anim } from "../../animations";

import { GLYPH } from "./shared";

export const SleepZ: React.FC = () => (
	<View
		style={{ position: "absolute", left: 108, top: 2, width: 40, height: 40, zIndex: 5 }}
		pointerEvents="none"
	>
		{[11, 14, 18].map((size, i) => (
			<Animated.Text
				key={size}
				style={[
					{ ...GLYPH, left: i * 7, top: 16 - i * 5, fontSize: size, color: "#FF9A5C", opacity: 0 },
					anim("z", "2.4s", { timing: "ease-out", delay: `${String(i * 0.8)}s` }),
				]}
			>
				Z
			</Animated.Text>
		))}
	</View>
);
