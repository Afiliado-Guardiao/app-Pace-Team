import { supabase } from "./client";
import { ITeamLastRuns, ITeamOnlineMate, IVirada } from "./teamLive.types";

// Atividade da equipe: disputa do Modo Virada, última corrida e quem está online.

export async function getVirada(): Promise<IVirada | null> {
	const { data, error } = await supabase.rpc("get_virada");
	if (error) throw error;
	return data;
}

export async function getTeamLastRuns(): Promise<ITeamLastRuns | null> {
	const { data, error } = await supabase.rpc("get_team_last_runs");
	if (error) throw error;
	return data;
}

export async function getTeamOnline(): Promise<ITeamOnlineMate[]> {
	const { data, error } = await supabase.rpc("get_team_online");
	if (error) throw error;
	return data;
}
