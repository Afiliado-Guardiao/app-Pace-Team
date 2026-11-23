// Textos do Team Pro usados fora da tela PRO (janela de assinatura e compra)

export type IProOfferSource = "ai" | "studio" | "analytics" | "hydration" | "general";

export const PRO_PURCHASE_TOASTS = {
	restored: { tone: "success", icon: "check-circle-2", title: "Compras restauradas" },
	nothingToRestore: {
		tone: "info",
		icon: "info",
		title: "Nenhuma assinatura encontrada",
		message: "Confira se está usando a mesma conta Apple da compra.",
	},
	pending: {
		tone: "info",
		icon: "clock",
		title: "Compra feita!",
		message: "A confirmação da Apple pode levar alguns minutos. O Pro libera sozinho.",
	},
	error: { tone: "danger", icon: "alert-circle", title: "Não deu certo agora. Tente de novo." },
} as const;

// O que a pessoa tentou usar (a frase de cima da janela)
export const PRO_OFFER_LEADS: Record<IProOfferSource, string> = {
	ai: "Para conversar com o Buddy sobre as suas corridas, assine o Team Pro.",
	studio: "Para usar esse visual no seu Buddy, assine o Team Pro.",
	analytics: "Para ver os relatórios da sua equipe, assine o Team Pro.",
	hydration: "Para registrar a água e receber a sua meta do dia, assine o Team Pro.",
	general: "Libere os recursos Pro para você e para a sua equipe.",
};

export const PRO_OFFER_COPY = {
	badge: "PACE TEAM PRO",
	title: "Você + 9 da sua equipe",
	sub: "Uma assinatura só libera os recursos Pro para até 10 pessoas da equipe, você incluso.",
	benefits: [
		{ icon: "sparkles", text: "PACE AI: o Buddy responde sobre as suas corridas" },
		{ icon: "palette", text: "Buddy Studio: cores, acessórios e efeitos" },
		{ icon: "chart-column", text: "Team Analytics: relatórios da equipe" },
		{ icon: "droplets", text: "PACE HYDRATION: a sua meta de água do dia" },
	],
	fair: "O Pro não dá pontos, km nem posição no ranking.",
	monthly: "Mensal",
	annual: "Anual",
	perMonth: "/mês",
	perYear: "/ano",
	annualEquivalent: " por mês",
	save: "Economize ",
	trialSuffix: " grátis",
	subscribe: "Assinar · ",
	startTrial: "Começar teste grátis",
	confirming: "Confirmando com a Apple…",
	loadError: "Não deu para carregar os planos. Verifique a internet.",
	retry: "Tentar de novo",
	later: "Agora não",
	legal:
		"A cobrança é feita na sua conta Apple ao confirmar a compra. A assinatura renova automaticamente pelo mesmo valor, a menos que seja cancelada pelo menos 24 horas antes do fim do período. Cancele quando quiser em Ajustes › [seu nome] › Assinaturas.",
	trialLegal: " Ao fim do teste grátis a assinatura é cobrada, salvo cancelamento antes.",
	restore: "Restaurar compras",
	terms: "Termos de Uso",
	privacy: "Política de Privacidade",
	doneTitle: "Você agora é PRO!",
	doneTeam: "A Apple confirmou. Até 10 pessoas da sua equipe já podem usar os recursos Pro.",
	doneSolo:
		"A Apple confirmou e os recursos Pro já são seus. Agora monte a sua equipe e convide até 9 pessoas: a assinatura vale para elas também.",
	doneCreateTeam: "Montar minha equipe",
	doneOk: "Bora!",
} as const;
