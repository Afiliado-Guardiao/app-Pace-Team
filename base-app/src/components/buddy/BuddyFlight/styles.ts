import { ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { BUDDY_H, BUDDY_W } from "../BuddyFigure";

// Mesmo tamanho do botão INICIAR (features/run/components/StartButton)
export const RING = 92;

interface IBuddyFlightStyles {
	layer: ViewStyle;
	buddy: ViewStyle;
	ring: ViewStyle;
}

export const createBuddyFlightStyles = (theme: ITheme): IBuddyFlightStyles => ({
	layer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 },
	buddy: { position: "absolute", top: 0, left: 0, width: BUDDY_W, height: BUDDY_H },
	ring: {
		position: "absolute",
		top: -RING / 2,
		left: -RING / 2,
		width: RING,
		height: RING,
		borderRadius: RING / 2,
		borderWidth: 3,
		borderColor: theme.pace.colors.route,
	},
});
