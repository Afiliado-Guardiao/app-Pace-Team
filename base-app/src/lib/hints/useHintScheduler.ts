import { useEffect, useRef } from "react";

import { HINT_TIMING, IHintId } from "./constants";
import { nextHint, useHintStore } from "./store";

// Mostra as dicas uma de cada vez, com uma pausa entre elas, enquanto o
// atleta explora o app. Montado uma vez (no layout das abas), depois da abertura.
export const useHintScheduler = (isReady: boolean): void => {
	const active = useHintStore((s) => s.active);
	const show = useHintStore((s) => s.show);
	const hide = useHintStore((s) => s.hide);
	const last = useRef<IHintId | null>(null);
	const isFirst = useRef(true);

	useEffect(() => {
		if (!isReady) return undefined;
		// Uma dica na tela: some sozinha depois de um tempo
		if (active) {
			last.current = active;
			const timer = setTimeout(hide, HINT_TIMING.showMs);
			return () => {
				clearTimeout(timer);
			};
		}
		// Sem dica: espera e mostra a próxima que estiver na tela (tenta de novo
		// se nenhuma estiver; o atleta pode trocar de tela no meio do caminho)
		const wait = isFirst.current ? HINT_TIMING.firstMs : HINT_TIMING.gapMs;
		const timer = setInterval(() => {
			const id = nextHint(last.current);
			if (!id) return;
			isFirst.current = false;
			show(id);
		}, wait);
		return () => {
			clearInterval(timer);
		};
	}, [isReady, active, show, hide]);
};
