import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { splitStopColor, useSvgId } from "@/components/pace";

interface IFadeProps {
	from: string;
	to: string;
	style: StyleProp<ViewStyle>;
}

// Degradê vertical simples (proteção do cabeçalho, emenda da ilustração).
// No iPhone o alfa do rgba() no <Stop> é ignorado: vai em stopOpacity.
export const Fade: React.FC<IFadeProps> = ({ from, to, style }) => {
	const id = useSvgId("map-fade");
	return (
		<Svg style={style} pointerEvents="none" preserveAspectRatio="none" viewBox="0 0 10 10">
			<Defs>
				<LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" {...splitStopColor(from)} />
					<Stop offset="1" {...splitStopColor(to)} />
				</LinearGradient>
			</Defs>
			<Rect width="10" height="10" fill={`url(#${id})`} />
		</Svg>
	);
};
