import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

// badge: selinho pequeno ao lado do nome (ex.: "PRO")
export type ISegmentOption = string | { value: string; label: string; badge?: string };
export type ISegmentSize = "sm" | "md";

export interface ISegmentedControlProps {
	options: readonly ISegmentOption[];
	value?: string;
	onChange?: (value: string) => void;
	size?: ISegmentSize;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ISegmentedControlStyles {
	surface: ViewStyle;
	content: ViewStyle;
	pressable: ViewStyle;
	item: ViewStyle;
	itemText: TextStyle;
	badge: ViewStyle;
	badgeText: TextStyle;
	activeText: TextStyle;
	containerAppearance: IGlassAppearance;
	activeAppearance: IGlassAppearance;
	idleAppearance: IGlassAppearance;
	itemRadius: number;
}
