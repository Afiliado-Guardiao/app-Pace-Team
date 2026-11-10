// PACE TEAM ANALYTICS (RPC get_team_analytics): tudo calculado das corridas válidas

export interface IAnalyticsWeek {
	// Segunda-feira 00:00 (horário de Brasília)
	start: string;
	km: number;
	points: number;
	runs: number;
	runners: number;
	// Posição na cidade e categoria naquela semana
	rank: { position: number | null; teams: number };
}

export interface IAnalyticsMember {
	id: string;
	name: string;
	avatarPath: string | null;
	role: "captain" | "athlete";
	isYou: boolean;
	weekKm: number;
	weekRuns: number;
	// Dias diferentes com corrida nesta semana
	weekDays: number;
	prevWeekKm: number;
	km28: number;
	days28: number;
}

export interface IAnalyticsRival {
	name: string;
	logoUrl: string | null;
	position: number;
	points: number;
	km: number;
	// Positivo = a rival está à frente
	gapPoints: number;
	gapKm: number;
}

export interface ITeamAnalytics {
	team: {
		id: string;
		name: string;
		city: string;
		size: number;
		logoUrl: string | null;
		members: number;
	};
	weekStart: string;
	// 8 semanas, da mais antiga para a atual
	weeks: IAnalyticsWeek[];
	members: IAnalyticsMember[];
	rival: IAnalyticsRival | null;
}
