import { TextStyle, ViewStyle } from "react-native";

export interface IWheelPickerItem {
	value: string | number;
	label: string;
}

export interface IWheelPickerProps {
	data: Array<string | number>;
	selectedValue: string | number;
	onValueChange: (value: string | number) => void;
	label?: string;
	unit?: string;
	pickerWidth?: number;
	translationNamespace?: string;
	monthTranslationPath?: string;
	enableHaptics?: boolean;
}

export interface IWheelPickerLibProps {
	data: IWheelPickerItem[];
	value: string | number;
	onValueChanged: (item: { item: IWheelPickerItem }) => void;
	onValueChanging?: (item: { item: IWheelPickerItem }) => void;
	itemHeight: number;
	visibleItemCount: number;
	height: number;
	scrollEventThrottle: number;
	itemTextStyle: TextStyle;
	selectedItemTextStyle: TextStyle;
	selectedItemContainerStyle: ViewStyle;
	containerProps: {
		style: ViewStyle;
	};
}

export interface IWheelPickerStyles {
	container: ViewStyle;
	label: TextStyle;
	pickerWrapper: ViewStyle;
	pickerContainer: ViewStyle;
}
