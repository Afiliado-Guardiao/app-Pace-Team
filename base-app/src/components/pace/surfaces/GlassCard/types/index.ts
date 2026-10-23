import { ImageStyle, StyleProp, ViewStyle } from "react-native";

import { IImageSource } from "../../../core/Avatar/types";
import { IGlassAppearance } from "../../../primitives";

export type IGlassCardVariant = "default" | "strong" | "dark" | "accent";

export interface IGlassCardProps {
	variant?: IGlassCardVariant;
	// Card com foto: imagem + scrim no lugar do vidro
	image?: IImageSource;
	padding?: number;
	radius?: number;
	onPress?: () => void;
	children?: React.ReactNode;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface IGlassCardStyles {
	surface: ViewStyle;
	image: ImageStyle;
	appearance: IGlassAppearance;
}
