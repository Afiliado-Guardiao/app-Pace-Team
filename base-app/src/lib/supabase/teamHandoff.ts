import { supabase } from "./client";
import { ITeamHandoffChoice, ITeamHandoffResult } from "./teamHandoff.types";

// Equipe criada no onboarding (conta provisória) segue o atleta quando o login
// da Apple cai na conta que ele já tinha. O token sai antes da troca de conta.

export async function startTeamHandoff(): Promise<string | null> {
	const { data, error } = await supabase.rpc("start_team_handoff");
	if (error) throw error;
	return data;
}

export async function claimTeamHandoff(
	token: string,
	choice: ITeamHandoffChoice,
): Promise<ITeamHandoffResult> {
	const { data, error } = await supabase.rpc("claim_team_handoff", {
		p_token: token,
		p_choice: choice,
	});
	if (error) throw error;
	return data;
}
