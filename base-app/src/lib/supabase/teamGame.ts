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

// Roleta terminou de girar: cada participante recebe o push com o desafio
// dele (só quem chamou pede, uma vez)
export async function pushTeamGame(gameId: string): Promise<void> {
	const { error } = await supabase.functions.invoke("team-game-push", { body: { gameId } });
	if (error) throw error;
}

export async function cancelTeamGame(gameId: string): Promise<ITeamGame | null> {
	const { data, error } = await supabase.rpc("cancel_team_game", { p_game: gameId });
	if (error) throw error;
	return data;
}
