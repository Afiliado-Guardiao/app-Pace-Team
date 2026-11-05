import type { SkFont, SkImage, SkPaint, SkPicture } from "@shopify/react-native-skia";

import type { IWeather } from "@/lib/weather";

// Um corredor na pista = um integrante da equipe online agora
export interface IHeroRunner {
	id: string;
	name: string;
	isMe: boolean;
}

// Tudo que os desenhos de cada quadro usam (criado fora do quadro)
export interface ISceneKit {
	ks: number;
	k: number;
	weather: IWeather;
	track: SkImage;
	base: SkPicture;
	sprites: SkImage[];
	names: string[];
	isMe: boolean[];
	tonePaint: SkPaint;
	font: SkFont | null;
}

// Posição da cena e do bloco dentro das camadas de tela cheia (céu e frente)
export interface IHeroFrame {
	// Canto da cena dentro da camada
	sceneX: number;
	sceneY: number;
	// Tamanho da camada
	width: number;
	height: number;
	// Fim do bloco (o céu e a chuva vão até 150 abaixo)
	blockBottom: number;
}
