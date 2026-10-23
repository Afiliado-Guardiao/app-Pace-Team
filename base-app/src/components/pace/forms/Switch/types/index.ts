import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ISwitchProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (value: boolean) => void;
	label?: string;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface ISwitchStyles {
	root: ViewStyle;
	label: TextStyle;
	track: ViewStyle;
	thumb: ViewStyle;
}
