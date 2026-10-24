export const PAYWALL_COPY = {
	titleStart: "Corra com",
	titleHighlight: "tudo liberado",
	subtitle: "Uma assinatura, o app inteiro: sua equipe, o ranking e o Pace Buddy.",
	monthly: "Mensal",
	annual: "Anual",
	perMonth: "/mês",
	perYear: "/ano",
	annualEquivalent: " por mês",
	save: "Economize ",
	trialSuffix: " grátis",
	subscribe: "Assinar por ",
	startTrial: "Começar teste grátis",
	restore: "Restaurar compras",
	signOut: "Sair da conta",
	deleteAccount: "Excluir conta",
	terms: "Termos de Uso",
	privacy: "Política de Privacidade",
	legal:
		"A cobrança é feita na sua conta Apple ao confirmar a compra. A assinatura renova automaticamente pelo mesmo valor, a menos que seja cancelada pelo menos 24 horas antes do fim do período. Cancele quando quiser em Ajustes › [seu nome] › Assinaturas.",
	trialLegal: " Ao fim do teste grátis a assinatura é cobrada, salvo cancelamento antes.",
	loadError: "Não deu para carregar os planos. Verifique a internet.",
	retry: "Tentar de novo",
	deleteTitle: "Excluir conta?",
	deleteBody:
		"Isso apaga para sempre seu perfil, corridas, posts e fotos. Se tiver uma assinatura ativa, cancele também em Ajustes › Assinaturas.",
	deleteConfirm: "Excluir para sempre",
	cancel: "Cancelar",
} as const;

export const PAYWALL_TOASTS = {
	restored: { tone: "success", icon: "check-circle-2", title: "Assinatura restaurada" },
	nothingToRestore: {
		tone: "info",
		icon: "info",
		title: "Nenhuma assinatura encontrada",
		message: "Confira se está usando a mesma conta Apple da compra.",
	},
	error: { tone: "danger", icon: "alert-circle", title: "Não deu certo agora. Tente de novo." },
} as const;

// O que a assinatura libera (tudo incluso nos dois planos)
export const PAYWALL_BENEFITS = [
	{ icon: "footprints", text: "Corridas com GPS e pontos para a sua equipe" },
	{ icon: "trophy", text: "Ranking semanal da cidade e Modo Virada" },
	{ icon: "medal", text: "Desafios, medalhas e conquistas do time" },
	{ icon: "sparkles", text: "Feed, stories e o Pace Buddy fora do app" },
] as const;
