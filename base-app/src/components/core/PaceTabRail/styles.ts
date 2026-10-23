import { ViewStyle } from "react-native";

const RAIL_RIGHT = 10;

export const createPaceTabRailStyles = (): { container: ViewStyle } => ({
	container: {
		position: "absolute",
		top: 0,
		bottom: 0,
		right: RAIL_RIGHT,
		justifyContent: "center",
		zIndex: 20,
	},
});
