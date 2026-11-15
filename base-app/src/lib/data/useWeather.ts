import { useCallback, useEffect } from "react";
import { AppState } from "react-native";

import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";

import { useQuery } from "@tanstack/react-query";

import { getWeatherNow } from "@/lib/supabase";
import { fetchMetWeather, fromWeatherNow, IWeather, toWeather } from "@/lib/weather";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { IWeatherRead, useWeatherCache } from "./weatherCache";

// Chuva muda rápido: lê de novo a cada 5 min e ao voltar para o app ou para
// o Início se a última leitura tem mais de 3 min
const REFRESH_MS = 5 * 60_000;
const STALE_ON_RETURN_MS = 3 * 60_000;
// Posição de até 3 h atrás serve para o tempo (não liga o GPS à toa)
const LAST_FIX_MAX_AGE_MS = 3 * 60 * 60_000;
// Sem leitura (GPS ou internet falharam): tenta de novo logo
const RETRY_MS = 20_000;
// Leitura salva vale para abrir o app mostrando o céu certo por até 1 h
const CACHE_MAX_AGE_MS = 60 * 60_000;

// Só usa a localização se o atleta já deu a permissão (nunca pede aqui)
async function coarsePosition(): Promise<{ lat: number; lng: number } | null> {
	const permission = await Location.getForegroundPermissionsAsync();
	if (!permission.granted) return null;
	const last = await Location.getLastKnownPositionAsync({ maxAge: LAST_FIX_MAX_AGE_MS });
	const fix =
		last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }));
	return { lat: fix.coords.latitude, lng: fix.coords.longitude };
}

type IRead = IWeatherRead;

// 1º o nosso servidor (radar no ponto exato + aeroporto); sem ele, a
// previsão da MET direto
async function readFresh(): Promise<IRead> {
	try {
		const at = await coarsePosition();
		if (!at) return null;
		const now = await getWeatherNow(at.lat, at.lng).catch(() => null);
		if (now) return { now };
		const met = await fetchMetWeather(at.lat, at.lng);
		return met ? { met } : null;
	} catch {
		return null;
	}
}

// Leitura nova; a boa fica salva para a próxima vez que o app abrir
async function readWeather(): Promise<IRead> {
	const read = await readFresh();
	useWeatherCache.getState().save(read);
	return read;
}

const toView = (read: IRead): IWeather => {
	if (read && "now" in read) return fromWeatherNow(read.now);
	return toWeather(read?.met ?? null, new Date());
};

// Tempo lá fora pela posição do aparelho: a cada 5 min, ao voltar para o app
// e ao abrir o Início. Sem permissão ou sem internet: dia ou noite pelo relógio.
export const useWeather = (): IWeather => {
	const cached = useWeatherCache((s) => (Date.now() - s.at < CACHE_MAX_AGE_MS ? s.read : null));
	const query = useQuery({
		queryKey: DATA_KEYS.weather,
		queryFn: readWeather,
		enabled: !IS_PREVIEW,
		staleTime: REFRESH_MS,
		// Sem leitura ainda: tenta de novo em 20 s (antes esperava 10 min)
		refetchInterval: (q) => (q.state.data ? REFRESH_MS : RETRY_MS),
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

	useFocusEffect(
		useCallback(() => {
			if (Date.now() - dataUpdatedAt > STALE_ON_RETURN_MS) void refetch();
		}, [refetch, dataUpdatedAt]),
	);

	// Enquanto a leitura nova não chega, mostra a última salva
	return toView(query.data ?? cached);
};
