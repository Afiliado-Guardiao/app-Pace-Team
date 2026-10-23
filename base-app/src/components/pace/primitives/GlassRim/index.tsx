import React from "react";
import { StyleSheet } from "react-native";

import Svg, { Defs, Path } from "react-native-svg";

import { useTheme } from "@/theme";

import { useSvgId } from "../../hooks";
import { roundedRectPath } from "../../utils";
import { GradientDef } from "../GradientLayers/GradientDef";

import { IGlassRimProps } from "./types";

// .pt-rim — borda branca de 1,2px em gradiente: quase sólida no canto
// superior esquerdo, some nas laterais e volta a brilhar embaixo à direita.
export const GlassRim: React.FC<IGlassRimProps> = ({ width, height, radius, bottomRadius }) => {
	const { theme } = useTheme();
	const id = useSvgId("pt-rim");
	const stroke = theme.pace.borders.rim;
	const inset = stroke / 2;
	const [rimLayer] = theme.pace.gradients.glassRim;
	const path = roundedRectPath({
		x: inset,
		y: inset,
		width: Math.max(0, width - stroke),
		height: Math.max(0, height - stroke),
		topRadius: radius - inset,
		bottomRadius: (bottomRadius ?? radius) - inset,
	});

	return (
		<Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
			<Defs>
				<GradientDef layer={rimLayer} id={id} width={width} height={height} />
			</Defs>
			<Path d={path} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} />
		</Svg>
	);
};

export * from "./types";
