import { supabase } from "./client";
import { ITeamGame, ITeamGameLevel, ITeamGameSpin } from "./teamGame.types";

// Roleta da equipe: o sorteio e a conferência das corridas são do servidor.

export async function getTeamGame(): Promise<ITeamGame | null> {
	const { data, error } = await supabase.rpc("get_team_game");
	if (error) throw error;
	return data;
}

export async function startTeamGame(level: ITeamGameLevel): Promise<ITeamGame | null> {
	const { data, error } = await supabase.rpc("start_team_game", { p_level: level });
	if (error) throw error;
	return data;
}

export async function spinTeamGame(gameId: string): Promise<ITeamGameSpin> {
	const { data, error } = await supabase.rpc("spin_team_game", { p_game: gameId });
	if (error) throw error;
	return data;
}

export async function cancelTeamGame(gameId: string): Promise<ITeamGame | null> {
	const { data, error } = await supabase.rpc("cancel_team_game", { p_game: gameId });
	if (error) throw error;
	return data;
}
