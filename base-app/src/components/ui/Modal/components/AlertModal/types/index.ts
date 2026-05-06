import { TextStyle, ViewStyle } from "react-native";

import { IAlertOptions } from "../../../types";

export interface IAlertModalProps {
	options: IAlertOptions;
	onConfirm: () => void;
}

export interface IAlertModalStyles {
	title: TextStyle;
	message: TextStyle;
	confirmButton: ViewStyle;
	confirmText: TextStyle;
}
