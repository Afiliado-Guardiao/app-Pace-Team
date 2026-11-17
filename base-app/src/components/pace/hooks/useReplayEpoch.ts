import { useSyncExternalStore } from "react";
import { AppState, AppStateStatus } from "react-native";

// Quase sempre "abrir o app" no iPhone é trazê-lo de volta da memória: sem
// abertura e sem montar a tela de novo, os números ficavam parados no valor.
// Cada volta do segundo plano conta como uma nova "rodada" e as contagens
// (CountUp) recomeçam.
let epoch = 0;
let last: AppStateStatus = AppState.currentState;
const listeners = new Set<() => void>();

AppState.addEventListener("change", (next) => {
	const cameBack = last === "background" && next === "active";
	last = next;
	if (!cameBack) return;
	epoch += 1;
	listeners.forEach((l) => {
		l();
	});
});

const subscribe = (listener: () => void): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

export const useReplayEpoch = (): number => useSyncExternalStore(subscribe, () => epoch);
