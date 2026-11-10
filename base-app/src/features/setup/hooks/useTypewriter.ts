import { useEffect, useState } from "react";

import * as Haptics from "expo-haptics";

import { useReducedMotion } from "react-native-reanimated";

interface IUseTypewriterReturn {
	shown: string;
	// O resto do texto (fica invisível, para o balão não crescer)
	rest: string;
	isTyping: boolean;
}

const LETTER_MS = 75;

// Balão do Buddy: o texto aparece letra por letra (1 a cada 75 ms) e cada
// letra dá uma vibração curtinha. Com "reduzir movimento", aparece inteiro.
export const useTypewriter = (text: string): IUseTypewriterReturn => {
	const isReduced = useReducedMotion();
	const [count, setCount] = useState(isReduced ? text.length : 0);

	useEffect(() => {
		if (isReduced) {
			setCount(text.length);
			return undefined;
		}
		setCount(0);
		let i = 0;
		const timer = setInterval(() => {
			i += 1;
			setCount(i);
			if (text.charAt(i - 1).trim()) void Haptics.selectionAsync().catch(() => undefined);
			if (i >= text.length) clearInterval(timer);
		}, LETTER_MS);
		return () => {
			clearInterval(timer);
		};
	}, [text, isReduced]);

	return { shown: text.slice(0, count), rest: text.slice(count), isTyping: count < text.length };
};
