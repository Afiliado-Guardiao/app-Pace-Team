import { useEffect, useState } from "react";

import { useReducedMotion } from "react-native-reanimated";

// Quanto da linha já foi desenhado (0 a 1), quadro a quadro. Vai pelo React
// (e não por animação nativa do SVG) para funcionar igual no iPhone e na
// prévia: o recorte e o traço do SVG mudam a cada quadro
export const useDrawProgress = (duration: number, delay: number): number => {
	const isReduced = useReducedMotion();
	const [t, setT] = useState(isReduced ? 1 : 0);

	useEffect(() => {
		if (isReduced) return undefined;
		let frame = 0;
		const start = Date.now() + delay;
		const tick = () => {
			const raw = Math.min(1, Math.max(0, (Date.now() - start) / duration));
			// Começa e termina devagar
			setT(raw < 0.5 ? 2 * raw * raw : 1 - (-2 * raw + 2) ** 2 / 2);
			if (raw < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(frame);
		};
	}, [isReduced, duration, delay]);

	return t;
};
