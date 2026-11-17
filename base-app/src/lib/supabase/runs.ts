import { supabase } from "./client";
import { IMyStats, IRunStatusDb } from "./pace.types";

export interface ISavedRun {
	id: string;
	startedAt: string;
	seconds: number;
	km: number;
	status: IRunStatusDb;
	points: number;
	route: [number, number][];
	// "team" = correu com a equipe (pelo app ou pelo Buddy)
	mode?: string;
	// "watch" = veio do relógio (app Saúde)
	source?: "app" | "watch";
	// Média de batimentos (só corridas do relógio que medem)
	avgHr?: number | null;
}

export interface ISaveRunPayload {
	mode: string;
	seconds: number;
	km: number;
	finishedAt: number;
	route: readonly (readonly [number, number])[];
}

// Percurso guardado com no máximo ~400 pontos (o suficiente para o desenho)
const MAX_ROUTE_POINTS = 400;
const COORD_DECIMALS = 5;
const RUN_COLUMNS =
	"id, started_at, duration_s, distance_m, status, points, route, mode, source, avg_hr";

const simplify = (route: ISaveRunPayload["route"]): [number, number][] => {
	const step = Math.max(1, Math.ceil(route.length / MAX_ROUTE_POINTS));
	const round = (n: number): number => Number(n.toFixed(COORD_DECIMALS));
	const picked = route.filter((_, i) => i % step === 0 || i === route.length - 1);
	return picked.map(([lat, lng]) => [round(lat), round(lng)]);
};

const isPoint = (value: unknown): value is [number, number] =>
	Array.isArray(value) && typeof value[0] === "number" && typeof value[1] === "number";

const toSavedRun = (row: {
	id: string;
	started_at: string;
	duration_s: number;
	distance_m: number;
	status: IRunStatusDb;
	points: number;
	route: unknown;
	mode?: string;
	source?: "app" | "watch";
	avg_hr?: number | null;
}): ISavedRun => ({
	id: row.id,
	startedAt: row.started_at,
	seconds: row.duration_s,
	km: row.distance_m / 1000,
	status: row.status,
	points: row.points,
	route: Array.isArray(row.route) ? row.route.filter(isPoint) : [],
	mode: row.mode,
	source: row.source ?? "app",
	avgHr: row.avg_hr ?? null,
});

// Salva a corrida; o banco valida (ritmo humano, mínimos) e calcula os pontos.
export async function saveRun(payload: ISaveRunPayload): Promise<ISavedRun> {
	const finishedAt = new Date(payload.finishedAt);
	const startedAt = new Date(payload.finishedAt - payload.seconds * 1000);
	const { data, error } = await supabase
		.from("runs")
		.insert({
			mode: payload.mode,
			started_at: startedAt.toISOString(),
			finished_at: finishedAt.toISOString(),
			duration_s: Math.round(payload.seconds),
			distance_m: Math.round(payload.km * 10000) / 10,
			route: simplify(payload.route),
		})
		.select(RUN_COLUMNS)
		.single();
	if (error) throw error;
	return toSavedRun(data);
}

export interface IWatchRunPayload {
	externalId: string;
	startedAt: number;
	finishedAt: number;
	seconds: number;
	km: number;
	route: readonly (readonly [number, number])[];
	avgHr: number | null;
	deviceName: string | null;
}

// Já está no PACE TEAM: a mesma corrida (código do app Saúde) ou uma corrida
// gravada no mesmo horário (pelo app ou por outro relógio)
const isAlreadyThere = (error: { code?: string; message?: string }): boolean =>
	error.code === "23505" || (error.message ?? "").includes("duplicate_run");

// Importa uma corrida do relógio (app Saúde). O banco valida com as mesmas
// regras das corridas do app e calcula os pontos. null = já estava lá.
export async function importWatchRun(run: IWatchRunPayload): Promise<ISavedRun | null> {
	const { data, error } = await supabase
		.from("runs")
		.insert({
			mode: "free",
			source: "watch",
			external_id: run.externalId,
			started_at: new Date(run.startedAt).toISOString(),
			finished_at: new Date(run.finishedAt).toISOString(),
			duration_s: Math.round(run.seconds),
			distance_m: Math.round(run.km * 10000) / 10,
			route: simplify(run.route),
			avg_hr: run.avgHr,
			device_name: run.deviceName,
		})
		.select(RUN_COLUMNS)
		.single();
	if (error) {
		if (isAlreadyThere(error)) return null;
		throw error;
	}
	return toSavedRun(data);
}

// Descarta uma corrida minha (sai do histórico, do ranking e dos pontos)
export async function deleteRun(id: string): Promise<void> {
	const { error } = await supabase.from("runs").delete().eq("id", id);
	if (error) throw error;
}

export async function getMyRuns(limit = 50): Promise<ISavedRun[]> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return [];
	const { data, error } = await supabase
		.from("runs")
		.select(RUN_COLUMNS)
		.eq("user_id", user.id)
		.order("started_at", { ascending: false })
		.limit(limit);
	if (error) throw error;
	return data.map(toSavedRun);
}

export async function getMyStats(): Promise<IMyStats> {
	const { data, error } = await supabase.rpc("get_my_stats");
	if (error) throw error;
	return data;
}
