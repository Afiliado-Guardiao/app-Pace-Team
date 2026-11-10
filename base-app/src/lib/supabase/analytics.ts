import { ITeamAnalytics } from "./analytics.types";
import { supabase } from "./client";

// Team Analytics da equipe do atleta (o servidor recusa quem não tem o Pro)
export async function getTeamAnalytics(): Promise<ITeamAnalytics | null> {
	const { data, error } = await supabase.rpc("get_team_analytics");
	if (error) throw error;
	return data;
}
