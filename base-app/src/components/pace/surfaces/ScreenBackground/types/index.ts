import { ImageSourcePropType, ImageStyle, ViewStyle } from "react-native";

export interface IScreenBackgroundProps {
	// Foto da tela misturada ao fundo (padrão: skyline ao entardecer)
	photo?: ImageSourcePropType;
	// Desfoque da foto em px (o design usa 40; telas de login usam ~22)
	blur?: number;
}

export interface IScreenBackgroundStyles {
	root: ViewStyle;
	mistLayer: ViewStyle;
	dim: ViewStyle;
	photoLayer: ViewStyle;
	image: ImageStyle;
}
