import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { SWIPE_TRASH_WIDTH } from "../hooks/useSwipeToDelete";

interface ISwipeToDeleteStyles {
	root: ViewStyle;
	trashArea: ViewStyle;
	trash: ViewStyle;
	cover: ViewStyle;
}

// Mesmo canto arredondado da linha da corrida (RunRow)
const RADIUS = 22;

export const createSwipeToDeleteStyles = (theme: ITheme): ISwipeToDeleteStyles => ({
	root: { position: "relative" },
	trashArea: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: RADIUS,
		backgroundColor: theme.pace.colors.statusDanger,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	trash: {
		width: SWIPE_TRASH_WIDTH,
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	cover: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
});
