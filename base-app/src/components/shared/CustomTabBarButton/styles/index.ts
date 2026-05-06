import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

export const getTabBarButtonStyle = (_theme: ITheme, pressed: boolean): ViewStyle => ({
	flex: 1,
	height: "100%",
	opacity: pressed ? 0.7 : 1,
	alignItems: "center",
	justifyContent: "center",
});
