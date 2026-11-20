import { useEffect, useState } from "react";

import { useReducedMotion } from "react-native-reanimated";

const STEP_MS = 24;
const START_MS = 200;

// Tracinhos acendendo em sequência (24 ms cada) ao entrar na seção
export const useTickCount = (target: number, isActive: boolean): number => {
	const reduceMotion = useReducedMotion();
	const [lit, setLit] = useState(0);

	useEffect(() => {
		if (!isActive) {
			setLit(0);
			return undefined;
		}
		if (reduceMotion) {
			setLit(target);
			return undefined;
		}
		setLit(0);
		let n = 0;
		let timer: ReturnType<typeof setInterval> | null = null;
		const start = setTimeout(() => {
			timer = setInterval(() => {
				n += 1;
				setLit(Math.min(n, target));
				if (n >= target && timer) clearInterval(timer);
			}, STEP_MS);
		}, START_MS);
		return () => {
			clearTimeout(start);
			if (timer) clearInterval(timer);
		};
	}, [target, isActive, reduceMotion]);

	return lit;
};
