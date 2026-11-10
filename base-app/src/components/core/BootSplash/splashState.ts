import { useSyncExternalStore } from "react";

// A abertura já saiu da frente? As animações do Início (medidor e número)
// esperam por isso para não rodarem escondidas atrás dela.
let isDone = false;
const listeners = new Set<() => void>();

export const markSplashDone = (): void => {
	if (isDone) return;
	isDone = true;
	listeners.forEach((l) => {
		l();
	});
};

const subscribe = (listener: () => void): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

export const useSplashDone = (): boolean => useSyncExternalStore(subscribe, () => isDone);
