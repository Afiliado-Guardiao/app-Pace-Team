import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type IButtonVariant = "default" | "outline" | "ghost" | "success" | "error" | "warning";

export type IButtonSize = "sm" | "md" | "lg";

export interface IButtonProps {
	children: React.ReactNode;
	onPress: () => void;
	variant?: IButtonVariant;
	size?: IButtonSize;
	disabled?: boolean;
	loading?: boolean;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	testID?: string;
	accessibilityLabel?: string;
}

export interface IButtonStyles {
	container: ViewStyle;
	text: TextStyle;
}
