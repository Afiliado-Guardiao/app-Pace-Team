import { supabase } from "./client";
import { IAthleteResult, IMyInvite, ITeamDetails, ITeamRankingEntry } from "./pace.types";

export type IRankingScope = "city" | "region" | "state" | "country";

// Equipes: criar, entrar, sair, convidar e consultar (todas via RPC).

const LOGO_BUCKET = "team-logos";

// Escudo da equipe (só o capitão): envia para team-logos/<equipe>/, grava a URL
// pública em teams.logo_url e apaga os escudos antigos da pasta.
export async function uploadTeamLogo(teamId: string, uri: string): Promise<void> {
	const body = await fetch(uri).then((r) => r.arrayBuffer());
	const path = `${teamId}/logo-${String(Date.now())}.jpg`;
	const { error } = await supabase.storage
		.from(LOGO_BUCKET)
		.upload(path, body, { contentType: "image/jpeg", upsert: false });
	if (error) throw error;
	const url = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl;
	const { error: updateError } = await supabase
		.from("teams")
		.update({ logo_url: url })
		.eq("id", teamId);
	if (updateError) throw updateError;
	const { data: files } = await supabase.storage.from(LOGO_BUCKET).list(teamId);
	const old = (files ?? []).map((f) => `${teamId}/${f.name}`).filter((p) => p !== path);
	if (old.length) await supabase.storage.from(LOGO_BUCKET).remove(old);
}

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

export interface ITeamForm {
	name: string;
	city: string;
	region: string;
	size: number;
	// Código do país (BR, PT, US…)
	country: string;
}

const teamArgs = (params: ITeamForm) => ({
	p_name: params.name,
	p_city: params.city,
	p_region: params.region,
	p_size: params.size,
	p_country: params.country,
});

export async function createTeam(params: ITeamForm): Promise<string> {
	const { data, error } = await supabase.rpc("create_team", teamArgs(params));
	if (error) throw error;
	return data;
}

// Capitão edita nome, cidade, região, país e categoria da equipe
export async function updateTeam(params: ITeamForm): Promise<string> {
	const { data, error } = await supabase.rpc("update_team", teamArgs(params));
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
