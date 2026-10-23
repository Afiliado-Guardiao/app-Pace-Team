import { supabase } from "./client";
import { IAthleteResult, IMyInvite, ITeamDetails, ITeamRankingEntry } from "./pace.types";

export type IRankingScope = "city" | "region" | "state" | "country";

// Equipes: criar, entrar, sair, convidar e consultar (todas via RPC).

export async function getMyTeam(): Promise<ITeamDetails | null> {
	const { data, error } = await supabase.rpc("get_my_team");
	if (error) throw error;
	return data;
}

export async function getTeam(teamId: string): Promise<ITeamDetails | null> {
	const { data, error } = await supabase.rpc("get_team", { p_team_id: teamId });
	if (error) throw error;
	return data;
}

export async function getTeamRanking(
	size: number,
	scope: IRankingScope,
): Promise<ITeamRankingEntry[]> {
	const { data, error } = await supabase.rpc("get_team_ranking", {
		p_size: size,
		p_scope: scope,
	});
	if (error) throw error;
	return data;
}

export async function createTeam(params: {
	name: string;
	city: string;
	region: string;
	size: number;
}): Promise<string> {
	const { data, error } = await supabase.rpc("create_team", {
		p_name: params.name,
		p_city: params.city,
		p_region: params.region,
		p_size: params.size,
	});
	if (error) throw error;
	return data;
}

export async function joinTeamByCode(code: string): Promise<string> {
	const { data, error } = await supabase.rpc("join_team_by_code", { p_code: code });
	if (error) throw error;
	return data;
}

export async function leaveTeam(): Promise<void> {
	const { error } = await supabase.rpc("leave_team");
	if (error) throw error;
}

export async function inviteToTeam(userId: string): Promise<void> {
	const { error } = await supabase.rpc("invite_to_team", { p_user_id: userId });
	if (error) throw error;
}

export async function respondInvite(inviteId: string, accept: boolean): Promise<void> {
	const { error } = await supabase.rpc("respond_invite", {
		p_invite_id: inviteId,
		p_accept: accept,
	});
	if (error) throw error;
}

export async function getMyInvites(): Promise<IMyInvite[]> {
	const { data, error } = await supabase.rpc("get_my_invites");
	if (error) throw error;
	return data;
}

export async function searchAthletes(query: string): Promise<IAthleteResult[]> {
	const { data, error } = await supabase.rpc("search_athletes", { p_query: query });
	if (error) throw error;
	return data;
}
