import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export interface ITopBarAction {
	icon: string;
	label: string;
	onPress?: () => void;
	badge?: boolean;
}

export interface ITopBarProps {
	// Texto ou nó (ex.: ponto de GPS + "Corrida livre") dentro da pílula central
	title?: React.ReactNode;
	onBack?: () => void;
	leftIcon?: string;
	right?: ITopBarAction;
	style?: StyleProp<ViewStyle>;
}

export interface ITopBarStyles {
	root: ViewStyle;
	spacer: ViewStyle;
	titlePill: ViewStyle;
	titleText: TextStyle;
	titleAppearance: IGlassAppearance;
}
