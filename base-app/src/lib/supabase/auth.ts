import { User } from "@supabase/supabase-js";

import { useStore } from "@/store";

import { supabase } from "./client";
import { IUser, ProfileRow } from "./types";

function mapUser(authUser: User, profile: ProfileRow): IUser {
	return {
		id: authUser.id,
		email: authUser.email ?? null,
		name: profile.name,
		birthday: profile.birthday,
		referralCode: profile.referral_code,
		isPremium: profile.is_premium,
		createdAt: profile.created_at,
		handle: profile.handle,
		city: profile.city,
		state: profile.state,
		avatarUrl: profile.avatar_path
			? supabase.storage.from("avatars").getPublicUrl(profile.avatar_path).data.publicUrl
			: null,
		privacy: profile.privacy,
	};
}

// Retorna o usuário logado (não-anônimo) com os dados do profile, ou null.
export async function getCurrentUser(): Promise<IUser | null> {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session || session.user.is_anonymous === true) {
		return null;
	}

	const { data: profile, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", session.user.id)
		.maybeSingle();

	if (error || !profile) {
		return null;
	}

	return mapUser(session.user, profile);
}

// Sincroniza o store Zustand com o estado de autenticação atual do Supabase.
export async function syncAuthState(): Promise<void> {
	const user = await getCurrentUser();
	useStore.getState().setUser(user);
}

// Garante que existe uma sessão (anônima, se necessário) para o onboarding.
export async function ensureSession(): Promise<void> {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		const { error } = await supabase.auth.signInAnonymously();
		if (error) throw error;
	}
}

// Assina mudanças de autenticação. Retorna a subscription para cleanup.
export function onAuthChange(callback: () => void): { unsubscribe: () => void } {
	const { data } = supabase.auth.onAuthStateChange(() => {
		callback();
	});
	return data.subscription;
}

export async function signInWithEmail(params: { email: string; password: string }): Promise<void> {
	const { error } = await supabase.auth.signInWithPassword(params);
	if (error) throw error;
	await syncAuthState();
}

async function applyProfileDetails(details: { name: string; birthday?: string }): Promise<void> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;
	await supabase
		.from("profiles")
		.update({ name: details.name, birthday: details.birthday ?? null })
		.eq("id", user.id);
}

// Cadastro: converte o usuário anônimo do onboarding em permanente. Se não
// houver sessão anônima, cria uma conta nova diretamente.
export async function signUpWithEmail(params: {
	email: string;
	password: string;
	name: string;
	// Dados do cadastro PACE TEAM (cidade e estado ficam nos metadados do usuário)
	birthday?: string;
	city?: string;
	state?: string;
}): Promise<void> {
	const { email, password, name, birthday, city, state } = params;
	const data = { name, birthday, city, state };
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user?.is_anonymous === true) {
		const { error } = await supabase.auth.updateUser({ email, password, data });
		if (error) throw error;
	} else {
		const { error } = await supabase.auth.signUp({ email, password, options: { data } });
		if (error) throw error;
	}

	await applyProfileDetails({ name, birthday });
	await syncAuthState();
}

// "Esqueci minha senha": envia o e-mail de redefinição do Supabase (com o
// código de 6 dígitos {{ .Token }} no modelo "Reset Password" do painel).
export async function sendPasswordReset(email: string): Promise<void> {
	const { error } = await supabase.auth.resetPasswordForEmail(email);
	if (error) throw error;
}

// Confere o código do e-mail, grava a senha nova e já deixa o atleta logado.
export async function resetPasswordWithCode(params: {
	email: string;
	code: string;
	newPassword: string;
}): Promise<void> {
	const { error } = await supabase.auth.verifyOtp({
		email: params.email,
		token: params.code,
		type: "recovery",
	});
	if (error) throw error;
	const { error: updateError } = await supabase.auth.updateUser({ password: params.newPassword });
	if (updateError) throw updateError;
	await syncAuthState();
}

// Login social — prontos para uso quando o app integrar os módulos nativos.
export async function signInWithApple(params: { idToken: string; nonce?: string }): Promise<void> {
	const { error } = await supabase.auth.signInWithIdToken({
		provider: "apple",
		token: params.idToken,
		nonce: params.nonce,
	});
	if (error) throw error;
	await syncAuthState();
}

export async function signInWithGoogle(params: { idToken: string }): Promise<void> {
	const { error } = await supabase.auth.signInWithIdToken({
		provider: "google",
		token: params.idToken,
	});
	if (error) throw error;
	await syncAuthState();
}

// Logout: encerra a sessão e recria uma anônima (para um novo onboarding).
export async function signOut(): Promise<void> {
	await supabase.auth.signOut();
	await supabase.auth.signInAnonymously();
	await syncAuthState();
}

export async function updateUserEmail(email: string): Promise<void> {
	const { error } = await supabase.auth.updateUser({ email });
	if (error) throw error;
	await syncAuthState();
}

// Troca de senha: valida a senha atual reautenticando antes de gravar a nova.
export async function updateUserPassword(params: {
	currentPassword: string;
	newPassword: string;
}): Promise<void> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user?.email) throw new Error("missing_email");

	const { error: verifyError } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: params.currentPassword,
	});
	if (verifyError) throw verifyError;

	const { error } = await supabase.auth.updateUser({ password: params.newPassword });
	if (error) throw error;
}

// Apaga as fotos do atleta (perfil e posts) antes da conta: o Storage não
// remove os arquivos sozinho quando o usuário some.
async function removeMyFiles(userId: string): Promise<void> {
	for (const bucket of ["avatars", "post-photos"]) {
		const { data } = await supabase.storage.from(bucket).list(userId, { limit: 1000 });
		const paths = (data ?? []).map((file) => `${userId}/${file.name}`);
		if (paths.length) await supabase.storage.from(bucket).remove(paths);
	}
}

// Exclusão de conta: apaga as fotos, a RPC sai da equipe e apaga auth.users
// (o resto cai em cascata); depois recria a sessão anônima.
export async function deleteAccount(): Promise<void> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) await removeMyFiles(user.id).catch(() => undefined);
	const { error } = await supabase.rpc("delete_account");
	if (error) throw error;
	await supabase.auth.signOut();
	await supabase.auth.signInAnonymously();
	await syncAuthState();
}
