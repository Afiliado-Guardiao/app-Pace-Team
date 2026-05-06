import { StyleProp, ViewStyle } from "react-native";

export interface IContainerProps {
	children: React.ReactNode;
	center?: boolean;
	padding?: keyof typeof import("@/theme").spacing;
	gap?: keyof typeof import("@/theme").spacing;
	style?: StyleProp<ViewStyle>;
}
