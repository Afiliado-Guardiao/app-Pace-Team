import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface IActivityGaugeProps {
	value: number;
	max?: number;
	size?: number;
	label?: string;
	// Texto mostrado no centro no lugar do número (ex.: "2.140")
	display?: string | number;
	unit?: string;
	stroke?: number;
	style?: StyleProp<ViewStyle>;
}

export interface IActivityGaugeStyles {
	root: ViewStyle;
	svg: ViewStyle;
	center: ViewStyle;
	value: TextStyle;
	unit: TextStyle;
	label: TextStyle;
	tickColor: string;
	glowColor: string;
}
