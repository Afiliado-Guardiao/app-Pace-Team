import { useEffect } from "react";
import { AppState } from "react-native";

import * as Location from "expo-location";

import { useQuery } from "@tanstack/react-query";

import { fetchMetWeather, IWeather, IWeatherReading, toWeather } from "@/lib/weather";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

const REFRESH_MS = 30 * 60_000;
// Ao voltar para o app, busca de novo se a última leitura tem mais de 10 min
const STALE_ON_RETURN_MS = 10 * 60_000;
// Posição de até 3 h atrás serve para o tempo (não liga o GPS à toa)
const LAST_FIX_MAX_AGE_MS = 3 * 60 * 60_000;

// Só usa a localização se o atleta já deu a permissão (nunca pede aqui)
async function coarsePosition(): Promise<{ lat: number; lng: number } | null> {
	const permission = await Location.getForegroundPermissionsAsync();
	if (!permission.granted) return null;
	const last = await Location.getLastKnownPositionAsync({ maxAge: LAST_FIX_MAX_AGE_MS });
	const fix =
		last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }));
	return { lat: fix.coords.latitude, lng: fix.coords.longitude };
}

async function readWeather(): Promise<IWeatherReading | null> {
	try {
		const at = await coarsePosition();
		return at ? await fetchMetWeather(at.lat, at.lng) : null;
	} catch {
		return null;
	}
}

// Tempo lá fora pela posição do aparelho: a cada 30 min e ao voltar para o
// app. Sem permissão ou sem internet: dia ou noite pelo relógio.
export const useWeather = (): IWeather => {
	const query = useQuery({
		queryKey: DATA_KEYS.weather,
		queryFn: readWeather,
		enabled: !IS_PREVIEW,
		staleTime: REFRESH_MS,
		refetchInterval: REFRESH_MS,
	});
	const { refetch, dataUpdatedAt } = query;

	useEffect(() => {
		const sub = AppState.addEventListener("change", (state) => {
			if (state === "active" && Date.now() - dataUpdatedAt > STALE_ON_RETURN_MS) void refetch();
		});
		return () => {
			sub.remove();
		};
	}, [refetch, dataUpdatedAt]);

	return toWeather(query.data ?? null, new Date());
};
