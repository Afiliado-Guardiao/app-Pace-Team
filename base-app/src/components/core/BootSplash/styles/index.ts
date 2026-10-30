import { ImageStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

interface IBootSplashStyles {
	root: ViewStyle;
	photo: ImageStyle;
	logo: ViewStyle;
}

// O logo fica na parte escura, logo abaixo dos corredores
export const createBootSplashStyles = (theme: ITheme): IBootSplashStyles => ({
	root: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: theme.pace.colors.navy[900],
	},
	photo: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
	logo: { position: "absolute", top: "66%", left: 0, right: 0, alignItems: "center" },
});
