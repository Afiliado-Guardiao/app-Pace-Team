import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IImageSource } from "../../../core/Avatar/types";
import { IGlassAppearance } from "../../../primitives";

export interface IRankRowProps {
	position: number;
	name: string;
	city?: string;
	points: string | number;
	km?: string | number;
	// Variação de posição na semana (+ subiu, − caiu, 0 manteve)
	delta?: number;
	logo?: IImageSource;
	isYou?: boolean;
	onPress?: () => void;
	animate?: boolean;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface IRankRowStyles {
	surface: ViewStyle;
	position: TextStyle;
	info: ViewStyle;
	nameRow: ViewStyle;
	name: TextStyle;
	youTag: ViewStyle;
	youText: TextStyle;
	sub: TextStyle;
	right: ViewStyle;
	points: TextStyle;
	pointsUnit: TextStyle;
	delta: ViewStyle;
	deltaText: TextStyle;
	appearance: IGlassAppearance;
	deltaColor: string;
}
