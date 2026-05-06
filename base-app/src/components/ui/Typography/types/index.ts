import { StyleProp, TextStyle } from "react-native";

export type ITextVariant = "body" | "caption" | "label";

export type ITitleLevel = 1 | 2 | 3 | 4;

export interface ITextProps {
	children: React.ReactNode;
	variant?: ITextVariant;
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
}

export interface ITitleProps {
	children: React.ReactNode;
	level?: ITitleLevel;
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
}
