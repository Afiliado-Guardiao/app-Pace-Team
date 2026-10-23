import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export type IInputType = "text" | "email" | "password" | "number" | "tel";

export interface IInputProps {
	label?: string;
	icon?: string;
	type?: IInputType;
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	onChangeText?: (text: string) => void;
	error?: string;
	hint?: string;
	trailing?: React.ReactNode;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
	accessibilityLabel?: string;
}

export interface IInputStyles {
	root: ViewStyle;
	label: TextStyle;
	field: ViewStyle;
	input: TextStyle;
	message: TextStyle;
	appearance: IGlassAppearance;
	iconColor: string;
	placeholderColor: string;
}
