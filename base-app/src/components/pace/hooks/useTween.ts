import { useEffect, useState } from "react";

import { useReducedMotion } from "react-native-reanimated";

interface IUseTweenOptions {
	duration: number;
	delay?: number;
	easing: (t: number) => number;
}

// Anima um número de 0 até o alvo (CountUp, arco do medidor). Com
// "reduzir movimento" ligado, vai direto ao valor final.
export const useTween = (target: number, options: IUseTweenOptions): number => {
	const { duration, delay = 0, easing } = options;
	const reduceMotion = useReducedMotion();
	const [value, setValue] = useState(reduceMotion ? target : 0);

	useEffect(() => {
		if (reduceMotion) {
			setValue(target);
			return;
		}

		let frame = 0;
		const start = Date.now() + delay;

		const step = (): void => {
			const t = Math.min(1, Math.max(0, (Date.now() - start) / duration));
			setValue(t >= 1 ? target : t <= 0 ? 0 : target * easing(t));
			if (t < 1) frame = requestAnimationFrame(step);
		};

		frame = requestAnimationFrame(step);
		return () => {
			cancelAnimationFrame(frame);
		};
	}, [target, duration, delay, easing, reduceMotion]);

	return value;
};
