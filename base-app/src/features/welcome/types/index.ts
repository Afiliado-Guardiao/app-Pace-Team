import { TextStyle, ViewStyle } from "react-native";

export interface IWelcomeScreenData {
	handleStartOnboarding: () => void;
}

export interface IWelcomeScreenStyles {
	container: ViewStyle;
	header: ViewStyle;
	content: ViewStyle;
	title: TextStyle;
	subtitle: TextStyle;
	footer: ViewStyle;
	ctaButton: ViewStyle;
}
