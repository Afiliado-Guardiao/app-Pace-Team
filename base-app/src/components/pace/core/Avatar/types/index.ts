import { ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

// URL (string) ou require() de um asset local
export type IImageSource = ImageSourcePropType | string;

export interface IAvatarProps {
	src?: IImageSource;
	name?: string;
	size?: number;
	ring?: boolean;
	square?: boolean;
	style?: StyleProp<ViewStyle>;
}

export interface IAvatarStyles {
	root: ViewStyle;
	clip: ViewStyle;
	image: ImageStyle;
	initials: TextStyle;
}
