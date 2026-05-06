import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ISectionProps {
	title: string;
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
}

export interface ISectionStyles {
	container: ViewStyle;
	title: TextStyle;
}
