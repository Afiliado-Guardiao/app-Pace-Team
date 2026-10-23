import { StyleProp, ViewStyle } from "react-native";

export interface IIconProps {
	// Nome Lucide em kebab-case, como no design system ("footprints", "map-pin")
	name: string;
	size?: number;
	strokeWidth?: number;
	color?: string;
	// Preenchimento (ex.: coração curtido)
	fill?: string;
	style?: StyleProp<ViewStyle>;
}
