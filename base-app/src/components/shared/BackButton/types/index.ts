import { TextStyle, ViewStyle } from "react-native";

export interface IBackButtonProps {
	onPress: () => void;
	disabled: boolean;
}

export interface IBackButtonStyles {
	button: ViewStyle;
	text: TextStyle;
}
