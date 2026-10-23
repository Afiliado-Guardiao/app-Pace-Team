import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IImageSource } from "../../../core/Avatar/types";
import { IGlassAppearance } from "../../../primitives";

export interface IPodiumTeam {
	name: string;
	points: string | number;
	logo?: IImageSource;
}

export type IPodiumPlace = 1 | 2 | 3;

export interface IPodiumProps {
	// Do 1º ao 3º colocado
	teams: readonly IPodiumTeam[];
	onSelect?: (team: IPodiumTeam) => void;
	style?: StyleProp<ViewStyle>;
}

export interface IPodiumColumnStyles {
	column: ViewStyle;
	avatarRing: ViewStyle;
	name: TextStyle;
	points: TextStyle;
	block: ViewStyle;
	number: TextStyle;
	appearance: IGlassAppearance;
	avatarSize: number;
}
