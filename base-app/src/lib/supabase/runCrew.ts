import { supabase } from "./client";

// Um de quem correu junto (o dono da corrida vem primeiro). O percurso vem
// só como desenho: graus relativos a um ponto comum, sem GPS.
export interface ICrewRunnerRow {
	userId: string;
	name: string;
	avatarPath: string | null;
	isOwner: boolean;
	isYou: boolean;
	isLive: boolean;
	meters: number;
	seconds: number;
	shape: [number, number][];
}

const isPoint = (value: unknown): value is [number, number] =>
	Array.isArray(value) && typeof value[0] === "number" && typeof value[1] === "number";

export const cleanCrew = (rows: unknown): ICrewRunnerRow[] =>
	Array.isArray(rows)
		? (rows as ICrewRunnerRow[]).map((r) => ({
				...r,
				shape: Array.isArray(r.shape) ? r.shape.filter(isPoint) : [],
			}))
		: [];

// Quem correu junto numa corrida (a equipe, o dono ou quem vê o post dela)
export async function getRunCrew(runId: string): Promise<ICrewRunnerRow[]> {
	const { data, error } = await supabase.rpc("get_run_crew", { p_run_id: runId });
	if (error) throw error;
	return cleanCrew(data);
}
