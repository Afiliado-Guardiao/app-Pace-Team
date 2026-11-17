// Corrida que o relógio salvou no app Saúde, pronta para ir ao PACE TEAM.
export interface IWatchRun {
	// Código da corrida no app Saúde (evita importar a mesma duas vezes)
	externalId: string;
	startedAt: number;
	finishedAt: number;
	seconds: number;
	km: number;
	// Percurso [lat, lng] (vazio quando o relógio não manda o mapa)
	route: [number, number][];
	// Média de batimentos por minuto (quando o relógio mede)
	avgHr: number | null;
	// Quem gravou ("Apple Watch", "Garmin Connect"…)
	deviceName: string | null;
}

// Treino do app Saúde já em números simples (antes de virar corrida)
export interface IHealthWorkout {
	uuid: string;
	startDate: Date;
	endDate: Date;
	durationSeconds: number;
	distance: { quantity: number; unit: string } | null;
	avgHr: number | null;
	sourceName: string | null;
	route: readonly { latitude: number; longitude: number }[];
}
