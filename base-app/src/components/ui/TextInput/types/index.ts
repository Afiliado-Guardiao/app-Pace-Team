import { KeyboardTypeOptions, StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ITextInputProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	keyboardType?: KeyboardTypeOptions;
	error?: string;
	disabled?: boolean;
	multiline?: boolean;
	maxLength?: number;
	style?: StyleProp<ViewStyle>;
	testID?: string;
	accessibilityLabel?: string;
}

export interface ITextInputStyles {
	container: ViewStyle;
	input: TextStyle;
	errorText: TextStyle;
}
