import React from "react";

import { LatLng, Polyline } from "react-native-maps";

interface IMapLineProps {
	// Pontos da linha (menos de 2 = escondida)
	coords: LatLng[] | null;
	color: string;
	width: number;
	// Cor e lugar de quando está escondida (continua montada)
	hidden: { line: LatLng[]; color: string };
}

// Linha do mapa sempre montada: sem pontos, fica invisível no lugar
export const MapLine: React.FC<IMapLineProps> = ({ coords, color, width, hidden }) => {
	const isOn = coords !== null && coords.length > 1;
	return (
		<Polyline
			coordinates={isOn ? coords : hidden.line}
			strokeColor={isOn ? color : hidden.color}
			strokeWidth={width}
			lineCap="round"
			lineJoin="round"
		/>
	);
};
