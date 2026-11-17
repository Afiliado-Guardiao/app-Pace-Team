import { useEffect, useState } from "react";

import { useReducedMotion } from "react-native-reanimated";

import { useSplashDone } from "@/components/core/BootSplash/splashState";

import { useReplayEpoch } from "./useReplayEpoch";

interface IUseTweenOptions {
	duration: number;
	delay?: number;
	easing: (t: number) => number;
	// Número contando não é movimento na tela: o CountUp anima mesmo com
	// "reduzir movimento" ligado (o arco do medidor respeita)
	isMotion?: boolean;
}

// Anima um número de 0 até o alvo (CountUp, arco do medidor). Espera a
// abertura (o Bud das bolinhas) sair da frente e recomeça sempre que o app
// volta do segundo plano (é assim que o atleta "abre" o app quase sempre).
export const useTween = (target: number, options: IUseTweenOptions): number => {
	const { duration, delay = 0, easing, isMotion = true } = options;
	const reduceMotion = useReducedMotion();
	const isStill = isMotion && reduceMotion;
	const isSplashDone = useSplashDone();
	const replay = useReplayEpoch();
	const [value, setValue] = useState(isStill ? target : 0);

	useEffect(() => {
		if (isStill) {
			setValue(target);
			return;
		}
		if (!isSplashDone) return;

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
	}, [target, duration, delay, easing, isStill, isSplashDone, replay]);

	return value;
};
