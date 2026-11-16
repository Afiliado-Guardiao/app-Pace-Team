import { useCallback } from "react";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { landAngle, SPIN_MS } from "../constants/wheel";

export interface IWheelLanding {
	challenge: number;
	slot: number;
	players: number;
}

interface IUseWheelSpinReturn {
	outerStyle: ReturnType<typeof useAnimatedStyle>;
	innerStyle: ReturnType<typeof useAnimatedStyle>;
	// Gira os dois anéis e para no desafio e no nome sorteados
	land: (to: IWheelLanding, onDone: () => void) => void;
	// Coloca direto (sem girar), ao abrir a tela no meio da roleta
	place: (to: IWheelLanding) => void;
}

const EASE = Easing.out(Easing.cubic);

// Os dois anéis giram juntos, em sentidos contrários, e freiam devagar
export const useWheelSpin = (): IUseWheelSpinReturn => {
	const outer = useSharedValue(0);
	const inner = useSharedValue(0);
	const isReduced = useReducedMotion();

	const land = useCallback(
		(to: IWheelLanding, onDone: () => void) => {
			const ms = isReduced ? 300 : SPIN_MS;
			outer.value = withTiming(
				landAngle({
					from: outer.value,
					index: to.challenge,
					n: 8,
					turns: isReduced ? 0 : 5,
					dir: 1,
				}),
				{ duration: ms, easing: EASE },
				(finished) => {
					if (finished) scheduleOnRN(onDone);
				},
			);
			inner.value = withTiming(
				landAngle({
					from: inner.value,
					index: to.slot,
					n: to.players,
					turns: isReduced ? 0 : 4,
					dir: -1,
				}),
				{ duration: ms, easing: EASE },
			);
		},
		[outer, inner, isReduced],
	);

	const place = useCallback(
		(to: IWheelLanding) => {
			outer.value = -(to.challenge * 360) / 8;
			inner.value = -(to.slot * 360) / to.players;
		},
		[outer, inner],
	);

	const outerStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${String(outer.value)}deg` }],
	}));
	const innerStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${String(inner.value)}deg` }],
	}));

	return { outerStyle, innerStyle, land, place };
};
