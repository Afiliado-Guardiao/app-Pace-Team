import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

import { useFocusEffect } from "expo-router";

import {
	SharedValue,
	useFrameCallback,
	useReducedMotion,
	useSharedValue,
} from "react-native-reanimated";

interface IUseSceneClockReturn {
	// Segundos de animação (para quando o app sai da tela ou o Início some)
	clock: SharedValue<number>;
	// Relógio parado (camadas sem nada se mexendo não redesenham)
	still: SharedValue<number>;
}

// Relógio das animações do Início. Com "Reduzir movimento" fica parado no
// primeiro quadro (corredores parados, sem chuva caindo).
export const useSceneClock = (): IUseSceneClockReturn => {
	const clock = useSharedValue(0);
	const still = useSharedValue(0);
	const reduceMotion = useReducedMotion();
	const [isFocused, setFocused] = useState(true);
	const [isForeground, setForeground] = useState(AppState.currentState === "active");

	useFocusEffect(
		useCallback(() => {
			setFocused(true);
			return () => {
				setFocused(false);
			};
		}, []),
	);

	useEffect(() => {
		const sub = AppState.addEventListener("change", (state) => {
			setForeground(state === "active");
		});
		return () => {
			sub.remove();
		};
	}, []);

	const frame = useFrameCallback((info) => {
		const dt = info.timeSincePreviousFrame ?? 0;
		// Volta de segundo plano: não pula para frente
		clock.value += Math.min(dt, 100) / 1000;
	}, false);

	const shouldRun = isFocused && isForeground && !reduceMotion;
	useEffect(() => {
		frame.setActive(shouldRun);
	}, [frame, shouldRun]);

	return { clock, still };
};
