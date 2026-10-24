// Retornos das RPCs de avisos, desafios e conquistas (jsonb em camelCase, ver
// base-supabase/supabase/migrations/*_pace_notifications_challenges.sql).

export type INotificationKind =
	| "team_run"
	| "overtook"
	| "overtaken"
	| "team_goal"
	| "invite"
	| "weekly_result"
	| "medal"
	| "challenge";

export type INotificationLink = "disputa" | "team" | "challenges" | "ranking";

export interface INotificationRow {
	id: string;
	kind: INotificationKind;
	icon: string;
	tone: "danger" | "accent" | "success" | "neutral";
	title: string;
	sub: string;
	link: INotificationLink | null;
	// Convite: { inviteId, teamName }
	data: { inviteId?: string; teamName?: string };
	createdAt: string;
	isRead: boolean;
}

export type IMedalId = "constancia" | "ritmo" | "explosao" | "madrugador" | "cem_km" | "top5";

export interface IMyChallenges {
	weekKm: number;
	weekRuns: number;
	// Melhor tempo estimado de 5 km (segundos) neste mês e antes dele
	best5k: number | null;
	previousBest5k: number | null;
	team: {
		name: string;
		size: number;
		weekKm: number;
		goalKm: number;
		// Semanas seguidas com corrida
		streak: number;
	} | null;
	medals: IMedalId[];
}

export interface ITeamAchievements {
	top5: boolean;
	maxStreak: number;
	totalKm: number;
	record: boolean;
}
