import { StyleProp, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export type IIconButtonVariant = "glass" | "accent" | "dark" | "light";

export interface IIconButtonProps {
	icon: string;
	// Texto para leitores de tela (obrigatório: o botão não tem texto visível)
	label: string;
	onPress?: () => void;
	variant?: IIconButtonVariant;
	size?: number;
	badge?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface IIconButtonStyles {
	pressable: ViewStyle;
	surface: ViewStyle;
	badge: ViewStyle;
	appearance: IGlassAppearance;
	iconColor: string;
	iconSize: number;
}
