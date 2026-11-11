// PACE AI: dados reais do atleta (get_ai_context) e o histórico de conversas

export interface IAiWeek {
	start: string;
	km: number;
	runs: number;
	minutes: number;
	paceSecKm: number | null;
}

export interface IAiRun {
	date: string;
	km: number;
	minutes: number;
	paceSecKm: number | null;
	withTeam: boolean;
}

export interface IAiMate {
	name: string;
	isYou: boolean;
	role: string;
	weekKm: number;
	weekRuns: number;
	prevWeekKm: number;
	km28: number;
	days28: number;
}

export interface IAiContext {
	today: string;
	weekStart: string;
	questionsToday: number;
	me: { name: string | null; totalKm: number; totalRuns: number; firstRun: string | null };
	weeks: IAiWeek[];
	months: { month: string; km: number; runs: number; paceSecKm: number | null }[];
	recent: IAiRun[];
	team: {
		name: string;
		weekKm: number;
		prevWeekKm: number | null;
		cityRank: { position: number | null; teams: number };
		rival: { name: string; position: number; km: number; gapKm: number } | null;
		mates: IAiMate[];
	} | null;
}

export interface IAiConversation {
	id: string;
	title: string;
	updated_at: string;
}

export interface IAiMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	created_at: string;
}

export interface IAiAnswer {
	conversationId: string;
	reply: string;
	left: number;
	limit: number;
}

// Motivos de recusa que o app explica ao atleta
export type IAiErrorCode = "limit" | "not_pro" | "not_configured" | "busy" | "offline";

export class AiError extends Error {
	constructor(public readonly code: IAiErrorCode) {
		super(code);
	}
}
