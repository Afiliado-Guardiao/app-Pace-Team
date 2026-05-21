import { syncAuthState } from "./auth";
import { supabase } from "./client";

interface IUpdateProfilePayload {
	name?: string;
	birthday?: string;
}

// Atualiza os campos editáveis do profile e ressincroniza o store.
export async function updateProfile(patch: IUpdateProfilePayload): Promise<void> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("not_authenticated");

	const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
	if (error) throw error;

	await syncAuthState();
}
