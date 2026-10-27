import { supabase } from "./client";

// Corrida de um colega (ou minha) vista pela equipe. O percurso vem vazio
// quando o colega não liga "Compartilhar rotas com a equipe".
export interface ITeamRunRow {
	id: string;
	userId: string;
	name: string;
	avatarPath: string | null;
	isYou: boolean;
	startedAt: string;
	seconds: number;
	km: number;
	points: number;
	status: "pending" | "valid" | "invalid";
	mode: string;
	route: [number, number][];
}

// Quem correu junto no mesmo horário
export interface ITeamRunMate {
	userId: string;
	name: string;
	avatarPath: string | null;
	isYou: boolean;
	km: number;
	seconds: number;
	route: [number, number][];
}

export interface ITeamRunDetail extends ITeamRunRow {
	mates: ITeamRunMate[];
}

// Colega correndo agora (posição dos últimos 2 min)
export interface ILivePosition {
	userId: string;
	name: string;
	avatarPath: string | null;
	lat: number;
	lng: number;
	at: string;
}

const isPoint = (value: unknown): value is [number, number] =>
	Array.isArray(value) && typeof value[0] === "number" && typeof value[1] === "number";

const cleanRoute = (route: unknown): [number, number][] =>
	Array.isArray(route) ? route.filter(isPoint) : [];

export async function getTeamRuns(limit = 40): Promise<ITeamRunRow[]> {
	const { data, error } = await supabase.rpc("get_team_runs", { p_limit: limit });
	if (error) throw error;
	const rows = (data ?? []) as ITeamRunRow[];
	return rows.map((r) => ({ ...r, route: cleanRoute(r.route) }));
}

export async function getTeamRun(id: string): Promise<ITeamRunDetail | null> {
	const { data, error } = await supabase.rpc("get_team_run", { p_run_id: id });
	if (error) throw error;
	const run = data as ITeamRunDetail | null;
	if (!run) return null;
	return {
		...run,
		route: cleanRoute(run.route),
		mates: run.mates.map((m) => ({ ...m, route: cleanRoute(m.route) })),
	};
}

// Corrida salva: a equipe recebe o push "fulano concluiu uma corrida"
export async function pushTeamRun(runId: string): Promise<void> {
	const { error } = await supabase.functions.invoke("team-run-push", { body: { runId } });
	if (error) throw error;
}

// Correndo com a equipe: manda a minha posição (os colegas veem no mapa)
export async function setLivePosition(lat: number, lng: number): Promise<void> {
	const { error } = await supabase.rpc("set_live_position", { p_lat: lat, p_lng: lng });
	if (error) throw error;
}

// Terminou: apaga a posição (ninguém mais vê onde a pessoa está)
export async function clearLivePosition(): Promise<void> {
	const { error } = await supabase.rpc("clear_live_position");
	if (error) throw error;
}

export async function getTeamLivePositions(): Promise<ILivePosition[]> {
	const { data, error } = await supabase.rpc("get_team_live_positions");
	if (error) throw error;
	return (data ?? []) as ILivePosition[];
}
