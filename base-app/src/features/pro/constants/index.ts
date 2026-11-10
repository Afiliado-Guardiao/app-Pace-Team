export const PRO_COPY = {
	back: "Voltar",
	badge: "PACE TEAM PRO",
	titleStart: "Você lidera.",
	titleHighlight: "Sua equipe evolui junto.",
	subtitle:
		"O PACE TEAM continua grátis. O Team Pro libera recursos avançados para até 10 integrantes da equipe, com uma assinatura só.",
	fair: "O Pro não compra pontos, km nem posição no ranking. Lá, todo mundo corre igual.",
	plansTitle: "Uma assinatura, a equipe inteira",
	plansSub: "Até 10 integrantes, capitão incluso. Sem cobrança por pessoa.",
	monthly: "Mensal",
	annual: "Anual",
	perMonth: "/mês",
	perYear: "/ano",
	annualEquivalent: " por mês",
	save: "Economize ",
	trialSuffix: " grátis",
	subscribe: "Tornar minha equipe PRO · ",
	startTrial: "Começar teste grátis",
	confirming: "Confirmando com a Apple…",
	restore: "Restaurar compras",
	terms: "Termos de Uso",
	privacy: "Política de Privacidade",
	cancelAnytime: "Cancele quando quiser. O PACE TEAM continua grátis.",
	legal:
		"A cobrança é feita na sua conta Apple ao confirmar a compra. A assinatura libera o Team Pro para até 10 integrantes da equipe de quem assina e renova automaticamente pelo mesmo valor, a menos que seja cancelada pelo menos 24 horas antes do fim do período. Cancele quando quiser em Ajustes › [seu nome] › Assinaturas.",
	trialLegal: " Ao fim do teste grátis a assinatura é cobrada, salvo cancelamento antes.",
	loadError: "Não deu para carregar os planos. Verifique a internet.",
	retry: "Tentar de novo",
	doneTitle: "Sua equipe agora é PRO!",
	doneBody:
		"A Apple confirmou. Os integrantes da equipe já podem usar o PACE AI, o Buddy Studio e o Team Analytics.",
	doneCta: "Bora!",
} as const;

// Cartão de status: o que muda para cada situação do atleta
export const PRO_STATUS_COPY = {
	noTeamTitle: "O Team Pro é da equipe",
	noTeamBody: "Crie sua equipe ou entre em uma. Aí o capitão pode tornar a equipe PRO.",
	noTeamCta: "Criar minha equipe",
	proTitle: " é PRO",
	covered: " de 10 integrantes com o Pro",
	youPay: "Você é quem assina.",
	paidBy: "Assinado por ",
	until: "Vale até ",
	manage: "Gerenciar assinatura",
	overTitle: "As 10 vagas Pro estão ocupadas",
	overBody:
		"Sua equipe é PRO, mas o Team Pro cobre 10 integrantes pela ordem de entrada. Você segue no Free, com tudo de corrida e ranking liberado.",
	memberTitle: "Só o capitão assina",
	memberBody:
		"Quando o capitão tornar a equipe PRO, até 10 integrantes ganham os recursos. Que tal avisar?",
	memberCta: "Avisar o capitão",
	memberShare:
		"Capitão, bora tornar nossa equipe PRO no PACE TEAM? Uma assinatura libera o PACE AI, o Buddy Studio e o Team Analytics para até 10 de nós.",
	linkTitle: "Você já tem o Team Pro",
	linkBodyFree: "Sua assinatura está sem equipe. Ligue ela à equipe que você capitaneia agora.",
	linkBodyOther: "Ela está ligada à ",
	linkBodyOtherEnd: ". Se trouxer para esta equipe, a outra perde o Pro na hora.",
	linkCta: "Usar nesta equipe",
} as const;

export const PRO_TOASTS = {
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
		message: "A confirmação da Apple pode levar alguns minutos. A equipe vira PRO sozinha.",
	},
	linked: { tone: "success", icon: "crown", title: "Assinatura ligada a esta equipe" },
	error: { tone: "danger", icon: "alert-circle", title: "Não deu certo agora. Tente de novo." },
} as const;

// Os três pilares do Team Pro
export const PRO_PILLARS = [
	{
		id: "ai",
		icon: "sparkles",
		title: "PACE AI",
		text: "O Buddy analisa suas corridas, responde por texto ou voz e ajuda cada um a evoluir.",
	},
	{
		id: "studio",
		icon: "palette",
		title: "PACE BUDDY STUDIO",
		text: "Skins, efeitos e visuais exclusivos para o Buddy. O que você ganha correndo continua seu.",
	},
	{
		id: "analytics",
		icon: "chart-column",
		title: "PACE TEAM ANALYTICS",
		text: "Relatórios do desempenho coletivo: evolução, participação e quanto falta para a rival.",
	},
] as const;
