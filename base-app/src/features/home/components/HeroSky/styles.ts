import { ViewStyle } from "react-native";

export const createHeroSkyStyles = (o: { top: number; width: number; height: number }) => ({
	layer: {
		position: "absolute",
		top: o.top,
		left: 0,
		width: o.width,
		height: o.height,
	} as ViewStyle,
	canvas: { width: o.width, height: o.height } as ViewStyle,
});
