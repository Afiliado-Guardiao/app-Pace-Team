import { AppState, Platform } from "react-native";

import * as Location from "expo-location";

import { create } from "zustand";

import { ROUTE } from "./demoRoute";

// Posição atual do atleta, mantida desde a abertura do app: a tela de
// correr já abre com o GPS pronto, sem esperar uma leitura nova.
export interface IGpsFix {
	lat: number;
	lng: number;
	accuracy: number;
	t: number;
}

interface IGpsState {
	fix: IGpsFix | null;
	setFix: (fix: IGpsFix) => void;
}

export const useGpsStore = create<IGpsState>()((set) => ({
	fix: null,
	setFix: (fix) => {
		set({ fix });
	},
}));

// Última posição guardada pelo iPhone vale se tiver até 5 min e 100 m de erro
const LAST_KNOWN = { maxAge: 5 * 60_000, requiredAccuracy: 100 } as const;
const WATCH = {
	accuracy: Location.Accuracy.BestForNavigation,
	timeInterval: 2000,
	distanceInterval: 2,
} as const;

let subscription: Location.LocationSubscription | null = null;
let isStarting = false;

const toFix = (location: Location.LocationObject): IGpsFix => ({
	lat: location.coords.latitude,
	lng: location.coords.longitude,
	accuracy: Math.round(location.coords.accuracy ?? 0),
	t: location.timestamp,
});

// Liga o GPS (só se a localização já foi liberada: não pede nada sozinho)
export async function startGpsWatch(): Promise<void> {
	const { setFix } = useGpsStore.getState();
	if (Platform.OS === "web") {
		setFix({ lat: ROUTE[0]?.[0] ?? 0, lng: ROUTE[0]?.[1] ?? 0, accuracy: 4, t: Date.now() });
		return;
	}
	if (subscription || isStarting) return;
	isStarting = true;
	try {
		const permission = await Location.getForegroundPermissionsAsync();
		if (!permission.granted) return;
		const last = await Location.getLastKnownPositionAsync(LAST_KNOWN);
		if (last && !useGpsStore.getState().fix) setFix(toFix(last));
		subscription = await Location.watchPositionAsync(WATCH, (location) => {
			setFix(toFix(location));
		});
	} finally {
		isStarting = false;
	}
}

export function stopGpsWatch(): void {
	subscription?.remove();
	subscription = null;
}

// Mantém o GPS ligado enquanto o app está aberto na tela (desliga em segundo
// plano para poupar bateria; a corrida usa a tarefa de segundo plano).
export function watchGpsWhileActive(): () => void {
	const ignore = (): undefined => undefined;
	startGpsWatch().catch(ignore);
	const listener = AppState.addEventListener("change", (state) => {
		if (state === "active") startGpsWatch().catch(ignore);
		else stopGpsWatch();
	});
	return () => {
		listener.remove();
		stopGpsWatch();
	};
}
