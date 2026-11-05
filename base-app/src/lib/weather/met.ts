import { IWeatherReading } from "./types";

// Previsão da MET Norway (instituto de meteorologia da Noruega): grátis
// inclusive para app comercial, sem chave, com crédito ("MET Norway") e um
// User-Agent que identifique o app. Coordenadas com no máximo 4 casas; aqui
// vão 2 (~1 km), o suficiente para o tempo e sem a posição exata do atleta.
const MET_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const USER_AGENT = "PaceTeam/1.0 github.com/Afiliado-Guardiao/app-Pace-Team";
const TIMEOUT_MS = 8000;

interface IMetResponse {
	properties?: {
		timeseries?: {
			data?: {
				instant?: { details?: { air_temperature?: number } };
				next_1_hours?: {
					summary?: { symbol_code?: string };
					details?: { precipitation_amount?: number };
				};
			};
		}[];
	};
}

const round2 = (n: number): string => n.toFixed(2);

export async function fetchMetWeather(lat: number, lng: number): Promise<IWeatherReading | null> {
	const controller = new AbortController();
	const timer = setTimeout(() => {
		controller.abort();
	}, TIMEOUT_MS);
	try {
		const res = await fetch(`${MET_URL}?lat=${round2(lat)}&lon=${round2(lng)}`, {
			headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
			signal: controller.signal,
		});
		if (!res.ok) return null;
		const body = (await res.json()) as IMetResponse;
		const now = body.properties?.timeseries?.[0]?.data;
		if (!now) return null;
		return {
			temp: now.instant?.details?.air_temperature ?? null,
			symbol: now.next_1_hours?.summary?.symbol_code ?? "",
			rainMm: now.next_1_hours?.details?.precipitation_amount ?? 0,
		};
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

export const WEATHER_CREDIT = "Previsão: MET Norway (met.no)";
