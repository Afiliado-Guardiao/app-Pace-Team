import { ViewStyle } from "react-native";

import { RUNNER_FEET, RUNNER_H, RUNNER_SCALE, RUNNER_W } from "../script";

interface IBuddyRunnerStyles {
	track: ViewStyle;
	mover: ViewStyle;
	body: ViewStyle;
	figure: ViewStyle;
}

// Trilho na largura da tela, com o chão na altura pedida
export const createBuddyRunnerStyles = (
	options: { feetY: number; offsetLeft: number; width: number },
	dir: 1 | -1,
): IBuddyRunnerStyles => ({
	track: {
		position: "absolute",
		top: options.feetY - RUNNER_FEET,
		left: -options.offsetLeft,
		width: options.width,
		height: RUNNER_H,
	},
	mover: { width: RUNNER_W, height: RUNNER_H },
	body: { width: RUNNER_W, height: RUNNER_H, transform: [{ scaleX: dir }] },
	figure: { transform: [{ scale: RUNNER_SCALE }], transformOrigin: "0% 0%" },
});
