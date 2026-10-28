// Chaves do React Query para os dados do PACE TEAM (invalidação após ações).
export const DATA_KEYS = {
	myTeam: ["pace", "my-team"] as const,
	team: (id: string) => ["pace", "team", id] as const,
	ranking: (size: number, scope: string) => ["pace", "ranking", size, scope] as const,
	rankingAll: ["pace", "ranking"] as const,
	feed: ["pace", "feed"] as const,
	myStats: ["pace", "my-stats"] as const,
	myRuns: ["pace", "my-runs"] as const,
	myInvites: ["pace", "my-invites"] as const,
	athletes: (query: string) => ["pace", "athletes", query] as const,
	athlete: (id: string) => ["pace", "athlete", id] as const,
	// Disputa, última corrida e presença da equipe (invalidados juntos)
	teamLiveAll: ["pace", "team-live"] as const,
	virada: ["pace", "team-live", "virada"] as const,
	teamLastRuns: ["pace", "team-live", "last-runs"] as const,
	teamOnline: ["pace", "team-live", "online"] as const,
	teamRuns: ["pace", "team-live", "runs"] as const,
	teamRun: (id: string) => ["pace", "team-live", "run", id] as const,
	teamLivePositions: ["pace", "team-live", "positions"] as const,
	notifications: ["pace", "notifications"] as const,
	challenges: ["pace", "challenges"] as const,
	teamAchievements: (id: string) => ["pace", "team-achievements", id] as const,
};
