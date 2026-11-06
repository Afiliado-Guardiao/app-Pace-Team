import { useCallback, useState } from "react";

import { useWeather } from "@/lib/data";
import { IWeather, WEATHER_CREDIT, weatherIcon, weatherLabel } from "@/lib/weather";

export interface IHeroWeather {
	weather: IWeather;
	icon: string;
	// "24°" (vazio sem temperatura)
	temp: string;
	label: string;
	credit: string | null;
	onLongPress: () => void;
}

// Clima do Início: só o tempo real lá fora. Segurar o selo mostra o crédito
// da previsão (obrigatório para usar a MET Norway).
export const useHeroWeather = (): IHeroWeather => {
	const weather = useWeather();
	const [showCredit, setShowCredit] = useState(false);
	const onLongPress = useCallback(() => {
		setShowCredit((v) => !v);
	}, []);

	const temp = weather.temp === null ? "" : `${String(Math.round(weather.temp))}°`;
	return {
		weather,
		icon: weatherIcon(weather.preset),
		temp,
		label: `${weatherLabel(weather.preset)}${temp ? ` ${temp}` : ""}`,
		credit: showCredit ? WEATHER_CREDIT : null,
		onLongPress,
	};
};
