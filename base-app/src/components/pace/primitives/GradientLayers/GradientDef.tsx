import React from "react";

import { LinearGradient, RadialGradient, Stop } from "react-native-svg";

import { linearGeometry, radialGeometry, splitStopColor } from "../../utils";

import { IGradientLayerProps } from "./types";

// Definição SVG de uma camada (linear ou radial) em coordenadas absolutas.
export const GradientDef: React.FC<IGradientLayerProps> = ({ layer, id, width, height }) => {
	const stops = layer.stops.map((stop, index) => (
		<Stop key={index} offset={stop.offset} {...splitStopColor(stop.color)} />
	));

	if (layer.type === "linear") {
		const geometry = linearGeometry(layer.angle, width, height);
		return (
			<LinearGradient id={id} gradientUnits="userSpaceOnUse" {...geometry}>
				{stops}
			</LinearGradient>
		);
	}

	const geometry = radialGeometry(layer, width, height);
	return (
		<RadialGradient
			id={id}
			gradientUnits="userSpaceOnUse"
			{...geometry}
			fx={geometry.cx}
			fy={geometry.cy}
		>
			{stops}
		</RadialGradient>
	);
};
