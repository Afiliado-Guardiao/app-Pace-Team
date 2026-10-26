import React from "react";
import { StyleSheet, View } from "react-native";

import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useTheme } from "@/theme";

import { useSvgId } from "../../hooks";
import { splitStopColor } from "../../utils";

// --gradient-progress esticado na largura atual do preenchimento (como no CSS,
// a ponta clara acompanha a frente da barra).
export const ProgressGradient: React.FC = () => {
	const { theme } = useTheme();
	const id = useSvgId("pt-progress");
	const [layer] = theme.pace.gradients.progress;

	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="none">
			<Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
				<Defs>
					<LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
						{layer.stops.map((stop, index) => (
							<Stop key={index} offset={stop.offset} {...splitStopColor(stop.color)} />
						))}
					</LinearGradient>
				</Defs>
				<Rect width="100%" height="100%" fill={`url(#${id})`} />
			</Svg>
		</View>
	);
};
