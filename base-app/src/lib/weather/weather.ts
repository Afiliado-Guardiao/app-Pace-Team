import { IWeather, IWeatherPreset, IWeatherReading } from "./types";

const HOT_C = 32;
const COLD_C = 10;
const SUN_FROM_C = 16;
const SUN_SPAN_C = 22;
const RAIN_FULL_MM = 8;
// Sem número de chuva, o símbolo já diz o tamanho dela (mm/h)
const MIN_MM = { light: 1.2, heavy: 5, thunder: 7 };
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

const rainMmOf = (reading: IWeatherReading): number => {
	const { symbol, rainMm } = reading;
	if (symbol.includes("thunder")) return Math.max(rainMm, MIN_MM.thunder);
	if (/heavy(rain|sleet)/.test(symbol)) return Math.max(rainMm, MIN_MM.heavy);
	if (/rain|sleet|drizzle/.test(symbol)) return Math.max(rainMm, MIN_MM.light);
	return 0;
};

const presetOf = (o: {
	symbol: string;
	temp: number | null;
	rain: number;
	isDay: boolean;
}): IWeatherPreset => {
	if (o.symbol.includes("thunder") || o.rain > 0.8) return "storm";
	if (o.rain > 0) return "rain";
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
	const rain = clamp01(rainMmH / RAIN_FULL_MM);
	const temp = reading.temp;
	const sun = sunOf({ isDay, temp, rain });
	return {
		preset: presetOf({ symbol: reading.symbol, temp, rain, isDay }),
		temp,
		rainMmH,
		isDay,
		sun,
		rain,
	};
};

const LABELS: Record<IWeatherPreset, string> = {
	day: "Ensolarado",
	hot: "Calor",
	cold: "Frio",
	night: "Noite",
	rain: "Chuva",
	storm: "Chuva forte",
};

const ICONS: Record<IWeatherPreset, string> = {
	day: "sun",
	hot: "sun",
	cold: "snowflake",
	night: "moon",
	rain: "cloud-rain",
	storm: "cloud-lightning",
};

export const weatherLabel = (preset: IWeatherPreset): string => LABELS[preset];
export const weatherIcon = (preset: IWeatherPreset): string => ICONS[preset];

// Para testar todos os climas (toque longo no selo do clima)
export const DEMO_WEATHERS: readonly IWeather[] = [
	{ preset: "day", temp: 24, rainMmH: 0, isDay: true, sun: 0.36, rain: 0 },
	{ preset: "hot", temp: 36, rainMmH: 0, isDay: true, sun: 0.91, rain: 0 },
	{ preset: "cold", temp: 6, rainMmH: 0, isDay: true, sun: 0, rain: 0 },
	{ preset: "night", temp: 17, rainMmH: 0, isDay: false, sun: 0, rain: 0 },
	{ preset: "rain", temp: 16, rainMmH: 3.2, isDay: true, sun: 0, rain: 0.4 },
	{ preset: "storm", temp: 14, rainMmH: 8, isDay: true, sun: 0, rain: 1 },
];
