import { ImageStyle, StyleProp } from "react-native";

export type ILogoVariant = "horizontal" | "white" | "symbol" | "icon" | "iconMono" | "iconOutline";

export interface ILogoProps {
	variant?: ILogoVariant;
	height?: number;
	style?: StyleProp<ImageStyle>;
}
