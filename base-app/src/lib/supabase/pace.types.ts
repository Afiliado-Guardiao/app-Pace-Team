// Retornos das funções RPC do PACE TEAM (jsonb em camelCase, ver
// base-supabase/supabase/migrations/*_pace_team_rpc.sql).

export interface ITeamRankingEntry {
	id: string;
	name: string;
	city: string;
	points: number;
	km: number;
	position: number;
	// Posições ganhas (+) ou perdidas (−) em relação à semana passada
	delta: number;
	logoUrl: string | null;
	isYou: boolean;
	members: number;
}

export interface ITeamMemberStat {
	id: string;
	name: string;
	role: "captain" | "athlete";
	isYou: boolean;
	km: number;
	points: number;
}

export interface ITeamInviteRow {
	id: string;
	name: string;
	status: "pending" | "accepted";
}

export interface ITeamDetails {
	id: string;
	name: string;
	city: string;
	region: string | null;
	state: string | null;
	size: number;
	description: string | null;
	logoUrl: string | null;
	inviteCode: string;
	createdAt: string;
	isCaptain: boolean;
	isMine: boolean;
	position: number;
	points: number;
	km: number;
	totalKm: number;
	members: ITeamMemberStat[];
	invites: ITeamInviteRow[];
	// Km da equipe de segunda a domingo
	weekDays: number[];
}

export interface IMyInvite {
	id: string;
	teamId: string;
	teamName: string;
	city: string;
	size: number;
	members: number;
}

export interface IAthleteResult {
	id: string;
	name: string;
	handle: string;
	hasTeam: boolean;
}

export interface IMyStats {
	runs: number;
	km: number;
	// Segundos por km
	avgPace: number;
	weekKm: number;
	weekPoints: number;
	weekRuns: number;
	monthKm: number;
	monthRuns: number;
	monthPoints: number;
	weekDays: number[];
	monthWeeks: number[];
}

export interface IFeedRow {
	id: string;
	name: string;
	team: string;
	teamId: string | null;
	imagePath: string | null;
	sample: number | null;
	seconds: number;
	km: number;
	layers: { route: boolean; stats: boolean; badge: boolean };
	caption: string;
	createdAt: string;
	likes: number;
	isLiked: boolean;
	isMine: boolean;
}

export type IRunStatusDb = "pending" | "valid" | "invalid";

// Folha "Privacidade" do Perfil (profiles.privacy)
export interface IPrivacySettings {
	showCity: boolean;
	publicProfile: boolean;
	shareRoutes: boolean;
	hideRouteEnds: boolean;
}
