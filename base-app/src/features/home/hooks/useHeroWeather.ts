import { useCallback, useState } from "react";

import { useWeather } from "@/lib/data";
import { DEMO_WEATHERS, IWeather, WEATHER_CREDIT, weatherIcon, weatherLabel } from "@/lib/weather";

export interface IHeroWeather {
	weather: IWeather;
	icon: string;
	// "24°" (vazio sem temperatura)
	temp: string;
	label: string;
	isDemo: boolean;
	credit: string | null;
	onPress: () => void;
	onLongPress: () => void;
}

// Clima do Início. Tocar no selo passa por todos os climas (para testar) e
// volta ao tempo real; segurar mostra o crédito da previsão.
export const useHeroWeather = (): IHeroWeather => {
	const real = useWeather();
	const [demo, setDemo] = useState(-1);
	const [showCredit, setShowCredit] = useState(false);
	const weather = demo >= 0 ? DEMO_WEATHERS[demo] : real;

	const onPress = useCallback(() => {
		setDemo((i) => (i + 1 >= DEMO_WEATHERS.length ? -1 : i + 1));
	}, []);
	const onLongPress = useCallback(() => {
		setShowCredit((v) => !v);
	}, []);

	const temp = weather.temp === null ? "" : `${String(Math.round(weather.temp))}°`;
	return {
		weather,
		icon: weatherIcon(weather.preset),
		temp,
		label: `${weatherLabel(weather.preset)}${temp ? ` ${temp}` : ""}`,
		isDemo: demo >= 0,
		credit: showCredit ? WEATHER_CREDIT : null,
		onPress,
		onLongPress,
	};
};
