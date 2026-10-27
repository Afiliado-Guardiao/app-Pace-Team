import { syncAuthState } from "./auth";
import { supabase } from "./client";
import { IPrivacySettings } from "./pace.types";

interface IUpdateProfilePayload {
	name?: string;
	birthday?: string;
	// Sem "@", minúsculas: letras, números, ponto e "_" (3 a 20)
	handle?: string | null;
	city?: string | null;
	state?: string | null;
	privacy?: IPrivacySettings;
}

const AVATAR_BUCKET = "avatars";

// URL pública da foto de perfil a partir do caminho salvo no banco
export function avatarUrlOf(path: string): string {
	return supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function currentUserId(): Promise<string> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("not_authenticated");
	return user.id;
}

// Atualiza os campos editáveis do profile e ressincroniza o store.
export async function updateProfile(patch: IUpdateProfilePayload): Promise<void> {
	const userId = await currentUserId();
	const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
	if (error) throw error;

	await syncAuthState();
}

// Troca a foto de perfil: envia para avatars/<uid>/, grava o caminho no
// profile e apaga as fotos antigas da pasta.
export async function uploadAvatar(uri: string): Promise<void> {
	const userId = await currentUserId();
	const body = await fetch(uri).then((r) => r.arrayBuffer());
	const path = `${userId}/avatar-${String(Date.now())}.jpg`;
	const { error } = await supabase.storage
		.from(AVATAR_BUCKET)
		.upload(path, body, { contentType: "image/jpeg", upsert: false });
	if (error) throw error;

	const { error: updateError } = await supabase
		.from("profiles")
		.update({ avatar_path: path })
		.eq("id", userId);
	if (updateError) throw updateError;

	const { data: files } = await supabase.storage.from(AVATAR_BUCKET).list(userId);
	const old = (files ?? []).map((f) => `${userId}/${f.name}`).filter((p) => p !== path);
	if (old.length) await supabase.storage.from(AVATAR_BUCKET).remove(old);

	await syncAuthState();
}
