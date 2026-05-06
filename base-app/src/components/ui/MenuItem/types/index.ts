import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Icon } from "phosphor-react-native";

export interface IMenuItemProps {
	icon: Icon;
	label: string;
	onPress: () => void;
	value?: string;
	showChevron?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
	accessibilityLabel?: string;
}

export interface IMenuItemStyles {
	container: ViewStyle;
	content: ViewStyle;
	contentPressed: ViewStyle;
	iconContainer: ViewStyle;
	label: TextStyle;
	value: TextStyle;
}
