import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

// whatsapp = verde do WhatsApp sem brilho (botão de convite da equipe)
export type IPaceButtonVariant = "primary" | "glass" | "outline" | "ghost" | "light" | "whatsapp";
export type IPaceButtonSize = "sm" | "md" | "lg";

export interface IPaceButtonProps {
	children?: React.ReactNode;
	onPress?: () => void;
	variant?: IPaceButtonVariant;
	size?: IPaceButtonSize;
	// Nome Lucide antes / depois do texto
	icon?: string;
	iconRight?: string;
	fullWidth?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
	accessibilityLabel?: string;
}

export interface IPaceButtonStyles {
	pressable: ViewStyle;
	surface: ViewStyle;
	text: TextStyle;
	appearance: IGlassAppearance;
	radius: number;
	iconSize: number;
}
