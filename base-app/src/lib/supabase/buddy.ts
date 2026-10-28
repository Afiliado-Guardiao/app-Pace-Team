import { supabase } from "./client";

// Pace Buddy no servidor: metas, cor, acessórios e despertador valem em
// qualquer aparelho; o celular registra o token de push e avisa a equipe.
export interface IBuddyProfile {
	goals: number;
	color: string;
	lastFree: string;
	equipped: string[];
}

export interface IBuddyProfileUpdate {
	color: string;
	lastFree: string;
	equipped: string[];
	// "06:30" ou null (desligado)
	alarmTime: string | null;
	alarmDays: number[];
}

export async function getBuddyProfile(): Promise<IBuddyProfile | null> {
	const { data, error } = await supabase
		.from("buddy_profiles")
		.select("goals, color, last_free, equipped")
		.maybeSingle();
	if (error) throw error;
	if (!data) return null;
	return {
		goals: data.goals,
		color: data.color,
		lastFree: data.last_free,
		equipped: data.equipped,
	};
}

export async function saveBuddyProfile(update: IBuddyProfileUpdate): Promise<void> {
	const { error } = await supabase.from("buddy_profiles").upsert({
		color: update.color,
		last_free: update.lastFree,
		equipped: update.equipped,
		alarm_time: update.alarmTime,
		alarm_days: update.alarmDays,
	});
	if (error) throw error;
}

// Meta cumprida pelo Buddy: soma e devolve o acessório liberado (ou null)
export async function completeBuddyGoal(): Promise<{ goals: number; unlocked: string | null }> {
	const { data, error } = await supabase.rpc("buddy_complete_goal");
	if (error) throw error;
	return data;
}

export async function registerBuddyDevice(token: string): Promise<void> {
	const { error } = await supabase.rpc("buddy_register_device", {
		p_token: token,
		p_platform: "ios",
	});
	if (error) throw error;
}

// "Estou online": a bolinha verde aparece para a equipe. Com notify, a equipe
// também recebe o aviso no celular (no máximo 1 a cada 2 h): só quando o
// atleta começa a correr ou fica 5 min com o app aberto.
export async function pingTeamOnline(notify = false): Promise<void> {
	const { error } = await supabase.functions.invoke("buddy-team-online", { body: { notify } });
	if (error) throw error;
}

// Começou a correr com a equipe: "Sua equipe está correndo, só falta você!"
export async function notifyTeamRunStart(): Promise<void> {
	const { error } = await supabase.functions.invoke("team-run-start", { body: {} });
	if (error) throw error;
}
