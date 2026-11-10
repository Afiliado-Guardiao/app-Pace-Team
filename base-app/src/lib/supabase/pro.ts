import { supabase } from "./client";
import { IMyPro } from "./pro.types";

// PACE TEAM PRO: o servidor decide quem tem os recursos Pro (assinatura da
// equipe confirmada pela Apple + até 10 integrantes). O app só pergunta.

export async function getMyPro(): Promise<IMyPro> {
	const { data, error } = await supabase.rpc("get_my_pro");
	if (error) throw error;
	return data;
}

// Quem paga leva a assinatura para a equipe que capitaneia agora
export async function linkMyProToTeam(): Promise<void> {
	const { error } = await supabase.rpc("link_my_pro_to_team");
	if (error) throw error;
}

// O capitão passa a liderança para outro integrante
export async function transferCaptain(userId: string): Promise<void> {
	const { error } = await supabase.rpc("transfer_captain", { p_user_id: userId });
	if (error) throw error;
}
