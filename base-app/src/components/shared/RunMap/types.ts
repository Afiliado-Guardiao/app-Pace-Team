import { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export type ILatLng = readonly [number, number];

export interface IMapRegionBubble {
	center: ILatLng;
	// raio em metros
	radius: number;
	count: string;
	label: string;
}

export interface IMapFriend {
	position: ILatLng;
	image: ImageSourcePropType;
	label: string;
}

export interface IRunMapProps {
	// Pontos da rota a desenhar (lat, lng)
	route: readonly ILatLng[];
	// Fração da rota desenhada (0–1), para a animação do protótipo
	progress?: number;
	showRoute?: boolean;
	// Mostra o ponto pulsante do atleta (no fim do trecho desenhado ou em `me`)
	showMe?: boolean;
	me?: ILatLng | null;
	regions?: readonly IMapRegionBubble[];
	friends?: readonly IMapFriend[];
	interactive?: boolean;
	style?: StyleProp<ViewStyle>;
}
