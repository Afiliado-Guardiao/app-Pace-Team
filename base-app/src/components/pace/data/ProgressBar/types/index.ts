import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type IProgressTone = "accent" | "success";

export interface IProgressBarProps {
	value: number;
	max?: number;
	label?: string;
	valueLabel?: string;
	height?: number;
	tone?: IProgressTone;
	// Atraso extra da animação de preenchimento (ms)
	delay?: number;
	style?: StyleProp<ViewStyle>;
}

export interface IProgressBarStyles {
	root: ViewStyle;
	header: ViewStyle;
	label: TextStyle;
	valueLabel: TextStyle;
	track: ViewStyle;
	fill: ViewStyle;
	fillClip: ViewStyle;
}
