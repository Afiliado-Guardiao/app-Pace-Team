import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export type IToastTone = "accent" | "success" | "warning" | "danger" | "info";

export interface IToastAction {
	label: string;
	onPress: () => void;
}

export interface IToastProps {
	tone?: IToastTone;
	icon?: string;
	title: string;
	message?: string;
	action?: IToastAction;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface IToastStyles {
	surface: ViewStyle;
	iconDot: ViewStyle;
	texts: ViewStyle;
	title: TextStyle;
	message: TextStyle;
	actionButton: ViewStyle;
	actionText: TextStyle;
	appearance: IGlassAppearance;
	toneColor: string;
	toneIcon: string;
}
