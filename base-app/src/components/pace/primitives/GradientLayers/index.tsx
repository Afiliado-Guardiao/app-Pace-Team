import React from "react";
import { StyleSheet } from "react-native";

import Svg, { Defs, Rect } from "react-native-svg";

import { useSvgId } from "../../hooks";

import { GradientDef } from "./GradientDef";
import { IGradientLayersProps } from "./types";

// Empilha camadas de gradiente como no CSS (a primeira da lista fica por cima).
export const GradientLayers: React.FC<IGradientLayersProps> = ({ layers, width, height }) => {
	const baseId = useSvgId("pt-grad");
	const ids = layers.map((_, index) => `${baseId}-${String(index)}`).reverse();
	const ordered = [...layers].reverse();

	return (
		<Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
			<Defs>
				{ordered.map((layer, index) => (
					<GradientDef
						key={ids[index]}
						layer={layer}
						id={ids[index]}
						width={width}
						height={height}
					/>
				))}
			</Defs>
			{ids.map((id) => (
				<Rect key={id} width={width} height={height} fill={`url(#${id})`} />
			))}
		</Svg>
	);
};

export * from "./types";
