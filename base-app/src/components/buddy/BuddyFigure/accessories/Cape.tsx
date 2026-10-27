import React from "react";
import { ViewStyle } from "react-native";

import Animated from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Polygon, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { anim, EASE_OUT } from "../../animations";

interface ICapeProps {
	isNew: boolean;
	isMini: boolean;
}

const BOX: ViewStyle = {
	position: "absolute",
	left: 12,
	top: 62,
	width: 116,
	height: 64,
	zIndex: 1,
};
const INNER: ViewStyle = {
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	transformOrigin: "50% 0%",
};

// Capa laranja por fora e azul-marinho por dentro, balançando atrás do Buddy.
export const Cape: React.FC<ICapeProps> = ({ isNew, isMini }) => {
	const outer = useSvgId("bd-cape-o");
	const inner = useSvgId("bd-cape-i");

	return (
		<Animated.View
			style={[
				BOX,
				isNew
					? anim("drop", "0.8s", { timing: EASE_OUT, delay: "0.35s", count: 1, fill: "both" })
					: null,
			]}
			pointerEvents="none"
		>
			<Animated.View style={[INNER, isMini ? null : anim("cape", "1.8s")]}>
				<Svg width={116} height={64}>
					<Defs>
						<LinearGradient id={outer} x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor="#FF7A2E" />
							<Stop offset="1" stopColor="#CD3600" />
						</LinearGradient>
						<LinearGradient id={inner} x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor="#23313F" />
							<Stop offset="1" stopColor="#0A1220" />
						</LinearGradient>
					</Defs>
					<Polygon points="23.2,0 92.8,0 116,64 0,64" fill={`url(#${outer})`} />
					<Polygon points="27.0,0 89.0,0 110,60 6,60" fill={`url(#${inner})`} />
				</Svg>
			</Animated.View>
		</Animated.View>
	);
};
