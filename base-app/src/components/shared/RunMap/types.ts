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
	// Foto do perfil (sem ela, as iniciais de `name`)
	image?: ImageSourcePropType;
	name?: string;
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
	// Foto do atleta no lugar do ponto branco (correndo com a equipe)
	meImage?: ImageSourcePropType;
	regions?: readonly IMapRegionBubble[];
	friends?: readonly IMapFriend[];
	interactive?: boolean;
	// Corrida ao vivo: a câmera acompanha o atleta (em `me` ou na ponta da rota)
	follow?: boolean;
	style?: StyleProp<ViewStyle>;
}
