import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type IStatTileSize = "sm" | "md" | "lg";

export interface IStatTileProps {
	icon?: string;
	label?: string;
	// Texto/número pt-BR (anima com CountUp) ou um nó já renderizado
	value: React.ReactNode;
	unit?: string;
	sub?: string;
	accent?: boolean;
	size?: IStatTileSize;
	style?: StyleProp<ViewStyle>;
}

export interface IStatTileStyles {
	root: ViewStyle;
	header: ViewStyle;
	iconDot: ViewStyle;
	label: TextStyle;
	valueRow: ViewStyle;
	value: TextStyle;
	unit: TextStyle;
	sub: TextStyle;
	iconColor: string;
}
