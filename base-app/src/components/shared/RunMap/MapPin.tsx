import React from "react";

import { LatLng, Marker } from "react-native-maps";

interface IMapPinProps {
	// Onde fica (null = escondido)
	at: LatLng | null;
	hiddenAt: LatLng;
	identifier: string;
	anchorY?: number;
	// Desenho que não muda (início e fim): o mapa não precisa redesenhar
	isStill?: boolean;
	children: React.ReactNode;
}

const CENTER = 0.5;

// Marcador sempre montado: sem posição, fica invisível no lugar
export const MapPin: React.FC<IMapPinProps> = ({
	at,
	hiddenAt,
	identifier,
	anchorY = CENTER,
	isStill = false,
	children,
}) => (
	<Marker
		identifier={identifier}
		coordinate={at ?? hiddenAt}
		anchor={{ x: CENTER, y: anchorY }}
		opacity={at ? 1 : 0}
		tracksViewChanges={!isStill}
	>
		{children}
	</Marker>
);
