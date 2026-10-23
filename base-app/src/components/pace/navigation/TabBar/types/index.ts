import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export interface ITabItem {
	id: string;
	icon: string;
	label: string;
}

export interface ITabBarProps {
	items?: readonly ITabItem[];
	active?: string;
	// Aba destacada com gradiente laranja quando não está ativa (ex.: Corrida)
	accentId?: string | null;
	onChange?: (id: string) => void;
	showLabels?: boolean;
	size?: number;
	// "vertical" = trilho de vidro na lateral direita (layout do app)
	orientation?: "horizontal" | "vertical";
	style?: StyleProp<ViewStyle>;
}

export interface ITabButtonStyles {
	button: ViewStyle;
	label: TextStyle;
	appearance: IGlassAppearance;
	iconSize: number;
	strokeWidth: number;
}

export interface ISideRailStyles {
	surface: ViewStyle;
	disc: ViewStyle;
	discAppearance: IGlassAppearance;
	railAppearance: IGlassAppearance;
	item: ViewStyle;
	label: ViewStyle;
	labelText: TextStyle;
	labelAppearance: IGlassAppearance;
	iconSize: number;
}
