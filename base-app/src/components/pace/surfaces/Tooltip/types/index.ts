import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IGlassAppearance } from "../../../primitives";

export type ITooltipPlacement = "top" | "bottom";

export interface ITooltipProps {
	children: React.ReactNode;
	// "top" = balão acima do alvo (seta embaixo)
	placement?: ITooltipPlacement;
	accent?: boolean;
	style?: StyleProp<ViewStyle>;
}

export interface ITooltipStyles {
	surface: ViewStyle;
	arrow: ViewStyle;
	text: TextStyle;
	appearance: IGlassAppearance;
}
