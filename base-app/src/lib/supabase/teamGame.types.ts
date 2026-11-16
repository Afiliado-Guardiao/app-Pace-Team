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
	wheel: ITeamGameCell[];
	stakes: { win: number; lose: number };
	players: ITeamGamePlayer[];
}

export interface ITeamGameSpin {
	userId: string;
	challenge: number;
	game: ITeamGame;
}
