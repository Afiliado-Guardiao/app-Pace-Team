import { supabase } from "./client";
import { IFeedRow } from "./pace.types";

const BUCKET = "post-photos";

export interface IPublishPostPayload {
	// Foto da câmera (arquivo local) ou índice de uma foto de exemplo
	uri?: string;
	sample?: number;
	seconds: number;
	km: number;
	layers: { route: boolean; stats: boolean; badge: boolean };
	caption: string;
	runId?: string | null;
	// "personal" = no perfil; "team" = post da equipe (foto do grupo)
	scope?: "personal" | "team";
}

const uniqueName = (): string =>
	`${String(Date.now())}-${Math.random().toString(36).slice(2, 10)}.jpg`;

// Envia a foto para a pasta do atleta no Storage e devolve o caminho.
async function uploadPhoto(uri: string): Promise<string> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("not_authenticated");
	const body = await fetch(uri).then((r) => r.arrayBuffer());
	const path = `${user.id}/${uniqueName()}`;
	const { error } = await supabase.storage
		.from(BUCKET)
		.upload(path, body, { contentType: "image/jpeg", upsert: false });
	if (error) throw error;
	return path;
}

export function postPhotoUrl(path: string): string {
	return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Publica no feed. Autor e equipe são preenchidos pelo banco.
export async function publishPost(payload: IPublishPostPayload): Promise<void> {
	const imagePath = payload.uri ? await uploadPhoto(payload.uri) : null;
	const { error } = await supabase.from("posts").insert({
		image_path: imagePath,
		sample: imagePath ? null : (payload.sample ?? 0),
		seconds: Math.round(payload.seconds),
		// 3 casas: com 2, o ritmo do post saía diferente do detalhe da corrida
		km: Math.round(payload.km * 1000) / 1000,
		layers: payload.layers,
		caption: payload.caption,
		run_id: payload.runId ?? null,
		scope: payload.scope ?? "personal",
	});
	if (error) throw error;
}

export async function getFeed(limit = 30): Promise<IFeedRow[]> {
	const { data, error } = await supabase.rpc("get_feed", { p_limit: limit });
	if (error) throw error;
	return data;
}

export type IReportReason = "ofensivo" | "nudez" | "spam" | "fraude" | "outro";

// Denúncia (o post some do meu feed; com 3 denúncias some para todos até a revisão)
export async function reportPost(postId: string, reason: IReportReason): Promise<void> {
	const { error } = await supabase.rpc("report_post", { p_post_id: postId, p_reason: reason });
	if (error) throw error;
}

// Bloqueio: os posts de um não aparecem mais para o outro
export async function blockUser(userId: string): Promise<void> {
	const { error } = await supabase.rpc("block_user", { p_user_id: userId });
	if (error) throw error;
}

// Apaga um post meu (a foto vai junto)
export async function deletePost(postId: string, imagePath: string | null): Promise<void> {
	const { error } = await supabase.from("posts").delete().eq("id", postId);
	if (error) throw error;
	if (imagePath) await supabase.storage.from(BUCKET).remove([imagePath]);
}

export async function setPostLike(postId: string, liked: boolean): Promise<void> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("not_authenticated");
	const { error } = liked
		? await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id })
		: await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
	if (error) throw error;
}
