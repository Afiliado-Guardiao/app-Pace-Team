export const ROUTES = {
	// Entrada (sem login)
	SPLASH: "/(non-auth)/splash",
	ONBOARDING: "/(non-auth)/onboarding",
	WELCOME: "/(non-auth)/welcome",
	LOGIN: "/(non-auth)/login",
	SIGNUP: "/(non-auth)/signup",

	// Abas (trilho lateral)
	HOME: "/(auth)/(tabs)/home",
	RUN: "/(auth)/(tabs)/run",
	RANKING: "/(auth)/(tabs)/ranking",
	TEAM: "/(auth)/(tabs)/team",
	PROFILE: "/(auth)/(tabs)/profile",

	// Telas internas
	NOTIFICATIONS: "/(auth)/notifications",
	VIRADA: "/(auth)/virada",
	RUN_LIVE: "/(auth)/run-live",
	RUN_SUMMARY: "/(auth)/run-summary",
	RUN_DETAIL: "/(auth)/run-detail",
	RUN_POST: "/(auth)/run-post",
	RUN_SHARE: "/(auth)/run-share",
	MAP: "/(auth)/map",
	CREATE_TEAM: "/(auth)/create-team",
	INVITE: "/(auth)/invite",
	TEAM_DETAILS: "/(auth)/team-details",
	HISTORY: "/(auth)/history",
	CHALLENGES: "/(auth)/challenges",
	BUDDY: "/(auth)/buddy",
	PAYWALL: "/(auth)/paywall",
} as const;

export type IRoute = (typeof ROUTES)[keyof typeof ROUTES];

// Abas do trilho lateral → rota
export const TAB_ROUTES: Partial<Record<string, IRoute>> = {
	home: ROUTES.HOME,
	run: ROUTES.RUN,
	ranking: ROUTES.RANKING,
	team: ROUTES.TEAM,
	profile: ROUTES.PROFILE,
};
