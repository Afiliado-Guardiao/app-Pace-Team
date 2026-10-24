import { supabase } from "./client";
import { IMyChallenges, INotificationRow, ITeamAchievements } from "./progress.types";

// Avisos, desafios e conquistas (calculados no banco a partir das corridas).

export async function getNotifications(): Promise<INotificationRow[]> {
	const { data, error } = await supabase.rpc("get_notifications");
	if (error) throw error;
	return data;
}

// ids = null marca todos como lidos
export async function markNotificationsRead(ids: string[] | null): Promise<void> {
	const { error } = await supabase.rpc("mark_notifications_read", { p_ids: ids });
	if (error) throw error;
}

export async function getMyChallenges(): Promise<IMyChallenges> {
	const { data, error } = await supabase.rpc("get_my_challenges");
	if (error) throw error;
	return data;
}

export async function getTeamAchievements(teamId: string): Promise<ITeamAchievements> {
	const { data, error } = await supabase.rpc("get_team_achievements", { p_team_id: teamId });
	if (error) throw error;
	return data;
}
