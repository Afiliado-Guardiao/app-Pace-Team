// Assinatura PACE TEAM (RevenueCat). Os dois planos liberam tudo.

export type IPlanPeriod = "monthly" | "annual";

export interface IPlan {
	// Identificador do pacote no RevenueCat ($rc_monthly / $rc_annual)
	id: string;
	period: IPlanPeriod;
	// Preço já formatado pela Apple na moeda da conta ("R$ 12,90")
	price: string;
	priceValue: number;
	// Anual dividido por 12 ("R$ 7,49"), para comparar com o mensal
	perMonth: string;
	// Teste grátis do plano, se houver ("7 dias")
	trial: string | null;
}

export interface ISubscriptionStatus {
	isActive: boolean;
	// Renova sozinha no fim do período (false = cancelada, vale até expiresAt)
	willRenew: boolean;
	expiresAt: string | null;
	productId: string | null;
}

export type IPurchaseResult = "purchased" | "cancelled";
