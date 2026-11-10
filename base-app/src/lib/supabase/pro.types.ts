// Status do PACE TEAM PRO para o atleta logado (RPC get_my_pro)
export interface IMyPro {
	// Este atleta tem os recursos Pro agora (equipe Pro e dentro das 10 vagas)
	isPro: boolean;
	// A equipe tem uma assinatura Team Pro valendo
	teamPro: boolean;
	teamId: string | null;
	teamName: string | null;
	isCaptain: boolean;
	// Foi este atleta que pagou a assinatura da equipe
	isPayer: boolean;
	payerName: string | null;
	members: number;
	// Integrantes cobertos (no máximo `limit`)
	covered: number;
	limit: number;
	productId: string | null;
	status: string | null;
	expiresAt: string | null;
	// Quando o Pro acaba de vez (cancelada, ou quem paga saiu da equipe)
	endsAt: string | null;
	// Assinatura paga por este atleta (pode estar ligada a outra equipe)
	hasOwnSub: boolean;
	ownSubTeamId: string | null;
	ownSubTeamName: string | null;
}
