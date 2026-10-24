import { Database } from "./database.types";
import { IPrivacySettings } from "./pace.types";

// Linhas cruas das tabelas (snake_case, como o Postgres retorna).
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type OnboardingRow = Database["public"]["Tables"]["onboardings"]["Row"];

// Usuário consumido pelo app (camelCase). Combina auth.users + profile.
export interface IUser {
	id: string;
	email: string | null;
	name: string;
	birthday: string | null;
	referralCode: string;
	isPremium: boolean;
	createdAt: string;
	// Perfil público do PACE TEAM
	handle?: string | null;
	city?: string | null;
	state?: string | null;
	// URL pública da foto de perfil (bucket "avatars") ou null
	avatarUrl?: string | null;
	privacy?: IPrivacySettings;
}

// Onboarding consumido pelo app (camelCase).
export interface IOnboarding {
	id: string;
	userId: string;
	name: string | null;
	email: string | null;
	birthday: string | null;
	completed: boolean;
	completedAt: string | null;
}

// Payload de sincronização do onboarding (apenas campos persistidos).
export interface ISyncOnboardingPayload {
	name?: string | null;
	email?: string | null;
	birthday?: string | null;
	completed?: boolean;
}

// Retornos das funções RPC.
export type IReferralStats = Database["public"]["Functions"]["get_referral_stats"]["Returns"];
export type IApplyReferralResponse =
	Database["public"]["Functions"]["apply_referral_code"]["Returns"];
