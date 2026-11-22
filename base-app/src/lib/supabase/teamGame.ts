import { supabase } from "./client";
import { IGamePoints, ITeamGame, ITeamGameLevel, ITeamGameSpin } from "./teamGame.types";

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

// Roletas fechadas em que joguei, com os pontos ganhos ou perdidos
export async function getMyGamePoints(): Promise<IGamePoints[]> {
	const { data, error } = await supabase.rpc("get_my_game_points");
	if (error) throw error;
	return data;
}

// Roleta terminou: quem jogou recebe o aviso do resultado (uma vez por roleta)
export async function pushTeamGameResult(gameId: string): Promise<void> {
	const body = { gameId, kind: "result" };
	const { error } = await supabase.functions.invoke("team-game-push", { body });
	if (error) throw error;
}
