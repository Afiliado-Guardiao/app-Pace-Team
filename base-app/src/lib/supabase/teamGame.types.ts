// Roleta da equipe ("Jogar com a equipe"): formato do get_team_game
export type ITeamGameLevel = "facil" | "medio" | "dificil";
export type ITeamGameStatus = "spinning" | "running" | "done" | "cancelled";
export type ITeamGamePlayerStatus = "pending" | "done" | "failed";

// Uma casa da roleta: distância (km) e pace (segundos por km)
export interface ITeamGameCell {
	km: number;
	pace: number;
}

export interface ITeamGamePlayer {
	userId: string;
	name: string;
	avatarPath: string | null;
	isYou: boolean;
	// Posição no anel de nomes
	slot: number;
	// Casa sorteada (null = ainda não girou para essa pessoa)
	challenge: number | null;
	km: number | null;
	pace: number | null;
	assignedAt: string | null;
	status: ITeamGamePlayerStatus;
	points: number | null;
	// O que correu no desafio (null = não correu no prazo)
	runKm?: number | null;
	runSeconds?: number | null;
}

export interface ITeamGame {
	id: string;
	level: ITeamGameLevel;
	status: ITeamGameStatus;
	isStarter: boolean;
	starterName: string;
	createdAt: string;
	endsAt: string | null;
	isSuccess: boolean | null;
	settledAt?: string | null;
	wheel: ITeamGameCell[];
	stakes: { win: number; lose: number };
	players: ITeamGamePlayer[];
}

// Pontos que a roleta me deu ou tirou (Histórico)
export interface IGamePoints {
	gameId: string;
	at: string;
	points: number;
	status: ITeamGamePlayerStatus;
	km: number | null;
	pace: number | null;
	// Corrida do desafio (null = não correu no prazo)
	runId: string | null;
	runKm: number | null;
	runSeconds: number | null;
}

export interface ITeamGameSpin {
	userId: string;
	challenge: number;
	game: ITeamGame;
}
