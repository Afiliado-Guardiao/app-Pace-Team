import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export type IChipSize = "sm" | "md";

export interface IChipProps {
	children: React.ReactNode;
	selected?: boolean;
	icon?: string;
	onPress?: () => void;
	size?: IChipSize;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface IChipStyles {
	pressable: ViewStyle;
	surface: ViewStyle;
	text: TextStyle;
	appearance: IGlassAppearance;
	radius: number;
	iconSize: number;
}
