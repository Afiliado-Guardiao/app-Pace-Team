import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export type ISelectOption = string | { value: string; label: string };

export interface ISelectProps {
	label?: string;
	icon?: string;
	options: readonly ISelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ISelectStyles {
	root: ViewStyle;
	label: TextStyle;
	field: ViewStyle;
	value: TextStyle;
	placeholder: TextStyle;
	list: ViewStyle;
	listScroll: ViewStyle;
	appearance: IGlassAppearance;
	iconColor: string;
}
