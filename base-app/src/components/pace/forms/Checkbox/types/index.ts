import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ICheckboxProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (value: boolean) => void;
	label?: React.ReactNode;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
	accessibilityLabel?: string;
}

export interface ICheckboxStyles {
	root: ViewStyle;
	box: ViewStyle;
	label: TextStyle;
}
