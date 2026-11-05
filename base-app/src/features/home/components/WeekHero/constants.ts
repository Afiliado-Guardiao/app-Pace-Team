import { IWeatherPreset } from "@/lib/weather";

// Cor do ícone do selo do clima (amarelo no sol, azul claro no frio/chuva)
export const WEATHER_ICON_COLORS: Record<IWeatherPreset, string> = {
	day: "#FFC94D",
	hot: "#FFC94D",
	cold: "#BFE0FF",
	night: "#E4ECF7",
	rain: "#BFE0FF",
	storm: "#BFE0FF",
};
