import { TextStyle,ViewStyle } from "react-native";

import { IConfirmOptions } from "../../../types";

export interface IConfirmModalProps {
	options: IConfirmOptions;
	onConfirm: () => void;
	onCancel: () => void;
}

export interface IConfirmModalStyles {
	title: TextStyle;
	message: TextStyle;
	buttonRow: ViewStyle;
	confirmButton: ViewStyle;
	cancelButton: ViewStyle;
	confirmText: TextStyle;
	cancelText: TextStyle;
}
