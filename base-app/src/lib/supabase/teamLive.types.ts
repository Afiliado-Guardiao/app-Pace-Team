// Retornos das RPCs de disputa e atividade da equipe (jsonb em camelCase, ver
// base-supabase/supabase/migrations/*_pace_team_virada.sql e *_pace_team_online.sql).

export interface IViradaTeam {
	id: string;
	name: string;
	city: string;
	points: number;
	km: number;
	position: number;
}

export interface IViradaRow extends IViradaTeam {
	isYou: boolean;
}

export interface IViradaMember {
	id: string;
	name: string;
	role: "captain" | "athlete";
	isYou: boolean;
	points: number;
}

export interface IViradaWeek {
	// Semana do ano (ISO)
	week: number;
	us: number;
	them: number;
}

export interface IViradaDays {
	us: number[];
	them: number[] | null;
}

export interface IVirada {
	team: IViradaTeam;
	// null = ainda não há outra equipe na mesma categoria e cidade
	rival: IViradaTeam | null;
	rows: IViradaRow[];
	// Pontos por dia, de segunda a domingo
	weekDays: IViradaDays;
	headToHead: IViradaWeek[];
	members: IViradaMember[];
}

export interface ITeamLastRun {
	id: string;
	userId: string;
	name: string;
	isYou: boolean;
	km: number;
	seconds: number;
	points: number;
	startedAt: string;
}

export interface ITeamLastRuns {
	teamId: string;
	// "2026-10-23" (dia em São Paulo) ou null se a equipe ainda não correu
	day: string | null;
	lastAt: string | null;
	runs: ITeamLastRun[];
}

export interface ITeamOnlineMate {
	id: string;
	name: string;
	lastSeen: string;
}
