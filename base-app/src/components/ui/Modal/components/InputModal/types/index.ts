import { TextStyle,ViewStyle } from "react-native";

import { IInputOptions } from "../../../types";

export interface IInputModalProps {
	options: IInputOptions;
	onConfirm: (value: string) => void;
	onCancel: () => void;
}

export interface IUseInputModalReturn {
	value: string;
	error: string | null;
	handleChangeText: (text: string) => void;
	handleConfirm: () => void;
}

export interface IInputModalStyles {
	title: TextStyle;
	input: ViewStyle & TextStyle;
	inputError: ViewStyle;
	errorText: TextStyle;
	buttonRow: ViewStyle;
	confirmButton: ViewStyle;
	cancelButton: ViewStyle;
	confirmText: TextStyle;
	cancelText: TextStyle;
}
