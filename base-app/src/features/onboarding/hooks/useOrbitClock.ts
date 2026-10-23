import { useEffect } from "react";

import {
	Easing,
	SharedValue,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { ORBIT } from "../constants";

const MS = 1000;

// Relógio da órbita: conta de 0 a 5 s e avisa quando a animação termina.
export const useOrbitClock = (onDone: () => void): SharedValue<number> => {
	const reduceMotion = useReducedMotion();
	const time = useSharedValue(0);

	useEffect(() => {
		if (reduceMotion) {
			time.value = ORBIT.iconAt + 1;
			const timer = setTimeout(onDone, ORBIT.endAt * MS);
			return () => {
				clearTimeout(timer);
			};
		}
		time.value = withTiming(
			ORBIT.endAt,
			{ duration: ORBIT.endAt * MS, easing: Easing.linear },
			(finished) => {
				if (finished) scheduleOnRN(onDone);
			},
		);
		return undefined;
	}, [time, onDone, reduceMotion]);

	return time;
};
