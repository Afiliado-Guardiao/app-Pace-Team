import { supabase } from "./client";
import { IApplyReferralResponse, IReferralStats } from "./types";

// Aplica um código de indicação ao usuário logado (RPC com validação no banco).
export async function applyReferralCode(params: { code: string }): Promise<IApplyReferralResponse> {
	const { data, error } = await supabase.rpc("apply_referral_code", { p_code: params.code });
	if (error) throw error;
	return data;
}

// Estatísticas de indicação do usuário logado.
export async function getReferralStats(): Promise<IReferralStats> {
	const { data, error } = await supabase.rpc("get_referral_stats", {});
	if (error) throw error;
	return data;
}
