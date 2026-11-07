import { supabase } from "./client";

// Tempo de agora no ponto do atleta (Edge Function weather-now: radar no ponto
// exato + aeroporto mais perto + previsão de reserva)
export interface IWeatherNow {
	preset: "day" | "hot" | "cold" | "night" | "rain" | "storm" | "cloudy";
	temp: number | null;
	rainMmH: number;
	isDay: boolean;
}

const PRESETS = new Set(["day", "hot", "cold", "night", "rain", "storm", "cloudy"]);

export async function getWeatherNow(lat: number, lng: number): Promise<IWeatherNow | null> {
	const { data, error } = await supabase.functions.invoke("weather-now", {
		body: { lat: Number(lat.toFixed(2)), lng: Number(lng.toFixed(2)) },
	});
	if (error || !data || typeof data !== "object") return null;
	const w = data as IWeatherNow;
	return PRESETS.has(w.preset) ? w : null;
}
