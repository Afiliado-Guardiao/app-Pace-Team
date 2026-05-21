import { supabase } from "./client";
import { IOnboarding, ISyncOnboardingPayload, OnboardingRow } from "./types";

function mapOnboarding(row: OnboardingRow): IOnboarding {
	return {
		id: row.id,
		userId: row.user_id,
		name: row.name,
		email: row.email,
		birthday: row.birthday,
		completed: row.completed,
		completedAt: row.completed_at,
	};
}

// Onboarding do usuário atual (anônimo ou permanente). Um registro por usuário.
export async function getMyOnboarding(): Promise<IOnboarding | null> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data, error } = await supabase
		.from("onboardings")
		.select("*")
		.eq("user_id", user.id)
		.maybeSingle();

	if (error || !data) return null;
	return mapOnboarding(data);
}

// Grava (upsert) o onboarding do usuário atual, chaveado por user_id.
export async function syncOnboarding(payload: ISyncOnboardingPayload): Promise<void> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("not_authenticated");

	const completed = payload.completed ?? false;
	const { error } = await supabase.from("onboardings").upsert(
		{
			user_id: user.id,
			name: payload.name ?? null,
			email: payload.email ?? null,
			birthday: payload.birthday ?? null,
			completed,
			completed_at: completed ? new Date().toISOString() : null,
		},
		{ onConflict: "user_id" },
	);

	if (error) throw error;
}
