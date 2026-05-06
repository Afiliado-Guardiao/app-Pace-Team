import { TextStyle, ViewStyle } from "react-native";

export interface IReferralSectionStyles {
	container: ViewStyle;
	title: TextStyle;
	myCodeRow: ViewStyle;
	myCodeText: TextStyle;
	copyIconButton: ViewStyle;
	usedCodeRow: ViewStyle;
	usedCodeText: TextStyle;
	inputRow: ViewStyle;
	input: ViewStyle & { color?: string };
	applyButton: ViewStyle;
	applyButtonText: TextStyle;
	countRow: ViewStyle;
	countText: TextStyle;
}
