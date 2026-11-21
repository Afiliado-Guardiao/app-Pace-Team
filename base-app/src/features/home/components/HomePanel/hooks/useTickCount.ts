import { useEffect, useState } from "react";

import { useReducedMotion } from "react-native-reanimated";

const START_MS = 200;
const UP_MS = 11;
const HOLD_MS = 140;
const DOWN_MS = 20;

// Medidor ao entrar na seção, como o painel de um carro: os tracinhos acendem
// até o fim, param um instante e voltam até o valor de verdade
// replay: muda ao abrir o app e ao voltar ao Início (a seção já estava na
// frente, então só "ficar ativa" não bastava para animar de novo)
export const useTickCount = (o: {
	target: number;
	isActive: boolean;
	total: number;
	replay: number;
}): number => {
	const { target, isActive, total, replay } = o;
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
		const timers: ReturnType<typeof setTimeout>[] = [];
		const at = (ms: number, n: number): void => {
			timers.push(
				setTimeout(() => {
					setLit(n);
				}, ms),
			);
		};
		for (let n = 1; n <= total; n++) at(START_MS + n * UP_MS, n);
		const top = START_MS + total * UP_MS + HOLD_MS;
		for (let n = total - 1, i = 1; n >= target; n--, i++) at(top + i * DOWN_MS, n);
		return () => {
			timers.forEach(clearTimeout);
		};
	}, [target, isActive, total, reduceMotion, replay]);

	return lit;
};
