import { TextStyle, ViewStyle } from "react-native";

export interface IBackButtonStyles {
	button: ViewStyle;
	text: TextStyle;
}

export interface IProgressBarStyles {
	container: ViewStyle;
	fill: ViewStyle;
}

export interface IActionButtonStyles {
	container: ViewStyle;
	button: ViewStyle;
	text: TextStyle;
}

export interface ISelectStepStyles {
	container: ViewStyle;
	title: TextStyle;
	subtitle: TextStyle;
	optionsContainer: ViewStyle;
	option: ViewStyle;
	optionText: TextStyle;
}

export interface ITransitionStepStyles {
	container: ViewStyle;
	title: TextStyle;
	subtitle: TextStyle;
}

export interface IInputStepStyles {
	container: ViewStyle;
	title: TextStyle;
	subtitle: TextStyle;
	inputWrapper: ViewStyle;
}
