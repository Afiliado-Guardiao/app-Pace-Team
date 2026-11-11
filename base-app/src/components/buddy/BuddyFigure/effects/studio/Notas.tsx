import React from "react";
import { Text } from "react-native";

import Animated from "react-native-reanimated";

import { anim } from "../../../animations";

const NOTES = [
	[6, 30, "♪"],
	[114, 16, "♫"],
	[118, 62, "♪"],
] as const;

// Buddy Studio · notas musicais: o Buddy "cantando"
export const Notas: React.FC = () => (
	<>
		{NOTES.map(([x, y, glyph], i) => (
			<Animated.View
				key={`${String(x)}-${String(y)}`}
				style={[
					{ position: "absolute", left: x, top: y, zIndex: 6 },
					anim("rise", "2s", { delay: `${String(i * 0.6)}s`, timing: "ease-out" }),
				]}
				pointerEvents="none"
			>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "800",
						color: "#FFFFFF",
						textShadowColor: "rgba(253,90,12,.9)",
						textShadowRadius: 8,
					}}
				>
					{glyph}
				</Text>
			</Animated.View>
		))}
	</>
);
