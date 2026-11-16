import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { anim } from "../../animations";

// Gota d'água que flutua ao lado da cabeça quando o Bud está com sede
const WRAP: ViewStyle = {
	position: "absolute",
	left: 112,
	top: 6,
	width: 16,
	height: 22,
	zIndex: 5,
};
const DROP: ViewStyle = {
	position: "absolute",
	left: 2,
	top: 6,
	width: 12,
	height: 12,
	borderTopLeftRadius: 0,
	borderTopRightRadius: 7,
	borderBottomLeftRadius: 7,
	borderBottomRightRadius: 7,
	backgroundColor: "#8FD9FF",
	transform: [{ rotate: "-45deg" }],
	boxShadow: "0 0 6px rgba(143,217,255,.7)",
};
const SHINE: ViewStyle = {
	position: "absolute",
	left: 6,
	top: 11,
	width: 3,
	height: 3,
	borderRadius: 2,
	backgroundColor: "rgba(255,255,255,.85)",
};

export const ThirstDrop: React.FC = () => (
	<Animated.View style={[WRAP, anim("float", "1.6s")]} pointerEvents="none">
		<View style={DROP} />
		<View style={SHINE} />
	</Animated.View>
);
