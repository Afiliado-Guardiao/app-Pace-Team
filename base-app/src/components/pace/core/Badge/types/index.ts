import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type IBadgeTone = "accent" | "success" | "warning" | "danger" | "info" | "neutral" | "solid";

export interface IBadgeProps {
	tone?: IBadgeTone;
	dot?: boolean;
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}

export interface IBadgeStyles {
	root: ViewStyle;
	dot: ViewStyle;
	text: TextStyle;
}
