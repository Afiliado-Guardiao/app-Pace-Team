import { IWeather, IWeatherPreset, IWeatherReading } from "./types";

const HOT_C = 32;
const COLD_C = 10;
const SUN_FROM_C = 16;
const SUN_SPAN_C = 22;
const RAIN_FULL_MM = 8;
// A previsão da cidade é de modelo: "pancada fraca possível" (0,1–0,4 mm)
// não é chuva lá fora. Só chove na tela com chuva de verdade prevista.
const RAIN_FROM_MM = 0.5;
// Temporal: trovoada prevista com chuva, ou chuva forte
const STORM_THUNDER_MM = 1;
const STORM_MM = 4;
// No temporal a chuva é forte (e tem relâmpago)
const STORM_RAIN = 0.85;
const DAY_FROM_H = 6;
const DAY_TO_H = 18;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
// Dia sem temperatura conhecida: um sol fraquinho
const MILD_SUN = 0.25;

const sunOf = (o: { isDay: boolean; temp: number | null; rain: number }): number => {
	if (!o.isDay || o.rain > 0) return 0;
	return o.temp === null ? MILD_SUN : clamp01((o.temp - SUN_FROM_C) / SUN_SPAN_C);
};

// Sem a previsão: dia ou noite pelo relógio
export const isDayByClock = (now: Date): boolean => {
	const hour = now.getHours();
	return hour >= DAY_FROM_H && hour < DAY_TO_H;
};

const isDayOf = (symbol: string, now: Date): boolean => {
	if (symbol.endsWith("_day")) return true;
	if (symbol.endsWith("_night") || symbol.endsWith("_polartwilight")) return false;
	return isDayByClock(now);
};

// Chuva na tela só pelo número previsto para a próxima hora (o símbolo
// sozinho, como "lightrainshowers" com 0,1 mm, não conta)
const rainMmOf = (reading: IWeatherReading): number =>
	reading.rainMm >= RAIN_FROM_MM ? reading.rainMm : 0;

const isStorm = (reading: IWeatherReading): boolean =>
	(reading.symbol.includes("thunder") && reading.rainMm >= STORM_THUNDER_MM) ||
	reading.rainMm >= STORM_MM;

const presetOf = (o: {
	symbol: string;
	temp: number | null;
	rain: number;
	isDay: boolean;
	storm: boolean;
}): IWeatherPreset => {
	if (o.storm) return "storm";
	if (o.rain > 0) return "rain";
	// Nublado, neblina ou chuvinha prevista fraca demais: meio-termo seguro
	if (/^(cloudy|fog)|rain|sleet|drizzle/.test(o.symbol)) return "cloudy";
	if (o.symbol.includes("snow") || (o.temp !== null && o.temp <= COLD_C)) return "cold";
	if (!o.isDay) return "night";
	if (o.temp !== null && o.temp >= HOT_C) return "hot";
	return "day";
};

// Leitura da previsão (ou nada, sem GPS/internet) → clima da cena
export const toWeather = (reading: IWeatherReading | null, now: Date): IWeather => {
	if (!reading) {
		const isDay = isDayByClock(now);
		const sun = sunOf({ isDay, temp: null, rain: 0 });
		return { preset: isDay ? "day" : "night", temp: null, rainMmH: 0, isDay, sun, rain: 0 };
	}
	const isDay = isDayOf(reading.symbol, now);
	const rainMmH = rainMmOf(reading);
	const storm = rainMmH > 0 && isStorm(reading);
	const rain = storm
		? Math.max(STORM_RAIN, clamp01(rainMmH / RAIN_FULL_MM))
		: clamp01(rainMmH / RAIN_FULL_MM);
	const temp = reading.temp;
	const preset = presetOf({ symbol: reading.symbol, temp, rain, isDay, storm });
	// Céu fechado: sem sol
	const sun = preset === "cloudy" ? 0 : sunOf({ isDay, temp, rain });
	return {
		preset,
		temp,
		rainMmH,
		isDay,
		sun,
		rain,
	};
};

const LABELS: Record<IWeatherPreset, string> = {
	cloudy: "Nublado",
	day: "Ensolarado",
	hot: "Calor",
	cold: "Frio",
	night: "Noite",
	rain: "Chuva",
	storm: "Chuva forte",
};

const ICONS: Record<IWeatherPreset, string> = {
	cloudy: "cloud",
	day: "sun",
	hot: "sun",
	cold: "snowflake",
	night: "moon",
	rain: "cloud-rain",
	storm: "cloud-lightning",
};

export const weatherLabel = (preset: IWeatherPreset): string => LABELS[preset];
export const weatherIcon = (preset: IWeatherPreset): string => ICONS[preset];

const STORM_RAIN_MIN = 0.85;
const HOT_SUN_FROM = 16;

// Resposta do servidor (radar + aeroporto) → clima da cena
export const fromWeatherNow = (w: {
	preset: IWeatherPreset;
	temp: number | null;
	rainMmH: number;
	isDay: boolean;
}): IWeather => {
	const rainBase = clamp01(w.rainMmH / RAIN_FULL_MM);
	const rain =
		w.preset === "storm" ? Math.max(STORM_RAIN_MIN, rainBase) : w.preset === "rain" ? rainBase : 0;
	const sunny = w.preset === "day" || w.preset === "hot";
	const sun = sunny
		? w.temp === null
			? MILD_SUN
			: clamp01((w.temp - HOT_SUN_FROM) / SUN_SPAN_C)
		: 0;
	return { preset: w.preset, temp: w.temp, rainMmH: w.rainMmH, isDay: w.isDay, sun, rain };
};

// Para testar todos os climas (toque longo no selo do clima)
export const DEMO_WEATHERS: readonly IWeather[] = [
	{ preset: "day", temp: 24, rainMmH: 0, isDay: true, sun: 0.36, rain: 0 },
	{ preset: "hot", temp: 36, rainMmH: 0, isDay: true, sun: 0.91, rain: 0 },
	{ preset: "cold", temp: 6, rainMmH: 0, isDay: true, sun: 0, rain: 0 },
	{ preset: "night", temp: 17, rainMmH: 0, isDay: false, sun: 0, rain: 0 },
	{ preset: "rain", temp: 16, rainMmH: 3.2, isDay: true, sun: 0, rain: 0.4 },
	{ preset: "storm", temp: 14, rainMmH: 8, isDay: true, sun: 0, rain: 1 },
	{ preset: "cloudy", temp: 21, rainMmH: 0, isDay: true, sun: 0, rain: 0 },
];
