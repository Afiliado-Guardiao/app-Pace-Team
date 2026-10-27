import { ViewStyle } from "react-native";

interface IBuddyButtonStyles {
	root: ViewStyle;
	figure: ViewStyle;
}

// O Buddy (140 × 135) reduzido e centrado num botão do tamanho dos outros
export const createBuddyButtonStyles = (size: number, scale: number): IBuddyButtonStyles => ({
	root: { width: size, height: size },
	figure: {
		position: "absolute",
		left: (size - 140 * scale) / 2,
		top: (size - 135 * scale) / 2 - 2,
		transform: [{ scale }],
		transformOrigin: "0% 0%",
	},
});
