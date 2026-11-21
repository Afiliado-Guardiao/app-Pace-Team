import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

interface IShadeProps {
	// Opacidade do preto de cima para baixo: [início, meio, fim]
	stops: readonly [number, number, number];
	width: number;
	height: number;
	style?: StyleProp<ViewStyle>;
}

// Sombra em degradê (preto) desenhada com SVG: funciona igual no iPhone e na
// web (o degradê de fundo do CSS não é garantido no iPhone)
export const Shade: React.FC<IShadeProps> = ({ stops, width, height, style }) => {
	const id = useSvgId("hp-shade");
	return (
		<View style={style} pointerEvents="none">
			<Svg width={width} height={height}>
				<Defs>
					<LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
						<Stop offset="0" stopColor="#000" stopOpacity={stops[0]} />
						<Stop offset="0.45" stopColor="#000" stopOpacity={stops[1]} />
						<Stop offset="1" stopColor="#000" stopOpacity={stops[2]} />
					</LinearGradient>
				</Defs>
				<Rect width={width} height={height} fill={`url(#${id})`} />
			</Svg>
		</View>
	);
};
