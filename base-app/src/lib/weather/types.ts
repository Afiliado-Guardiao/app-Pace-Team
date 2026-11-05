// Clima do Início (céu e pista mudam com o tempo lá fora)
export type IWeatherPreset = "day" | "hot" | "cold" | "night" | "rain" | "storm";

// O que a previsão (MET Norway) diz para a hora atual
export interface IWeatherReading {
	temp: number | null;
	// Código do símbolo da MET, ex.: "clearsky_day", "heavyrainandthunder"
	symbol: string;
	// Chuva prevista para a próxima hora (mm)
	rainMm: number;
}

export interface IWeather {
	preset: IWeatherPreset;
	temp: number | null;
	rainMmH: number;
	isDay: boolean;
	// 0..1: força do sol (pelo calor) e da chuva (pelos mm/h)
	sun: number;
	rain: number;
}
