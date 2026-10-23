import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IImageSource } from "../../Avatar/types";

export interface IAvatarPerson {
	name: string;
	src?: IImageSource;
}

export interface IAvatarStackProps {
	people?: readonly IAvatarPerson[];
	max?: number;
	size?: number;
	// Número fixo no círculo "+N" (senão = pessoas além do máximo)
	extra?: number;
	style?: StyleProp<ViewStyle>;
}

export interface IAvatarStackStyles {
	root: ViewStyle;
	item: ViewStyle;
	first: ViewStyle;
	rest: ViewStyle;
	restText: TextStyle;
}
