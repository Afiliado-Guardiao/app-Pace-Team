import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface IRadioProps {
	checked?: boolean;
	onChange?: (value: true) => void;
	label?: string;
	description?: string;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface IRadioStyles {
	root: ViewStyle;
	circle: ViewStyle;
	dot: ViewStyle;
	texts: ViewStyle;
	label: TextStyle;
	description: TextStyle;
}
