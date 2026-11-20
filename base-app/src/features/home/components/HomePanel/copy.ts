import { IProSectionId } from "./constants";

// Textos do painel do Início (título acima do card e cada seção)
export const PANEL_COPY = {
	points: { title: "Seus pontos", unit: "pts", lineA: "Pontos da semana" },
	pointsSub: (runs: number) =>
		runs === 1 ? "Semana · 1 corrida" : `Semana · ${String(runs)} corridas`,
	pointsLeft: (km: string, goal: number) => `Faltam ${km} km para a meta de ${String(goal)} km`,
	pointsDone: "Meta da semana batida!",
	buddy: { title: "Sua semana", subtitle: "Cada km ajuda o time." },
	run: {
		title: "Corrida",
		subtitle: "Pronto para sair?",
		start: "Começar corrida",
		ready: "GPS pronto",
		last: "Última",
		time: "Tempo",
		pace: "Pace",
		none: "Sua primeira corrida aparece aqui",
		play: "Começar corrida",
	},
	wheel: {
		title: "Roleta da equipe",
		subtitle: "Nomes + desafios com a equipe",
		text: "Gira por quem está online: cada um tira um desafio de km e pace.",
		action: "Começar",
	},
	ranking: {
		title: "Ranking",
		noTeam: "Entre numa equipe para disputar",
		inCity: (city: string) => `em ${city}`,
		gap: (pts: string, name: string) => `Faltam ${pts} pts para passar ${name}`,
		top: "Sua equipe lidera a cidade",
		action: "Ver ranking",
	},
	team: {
		title: "Equipe",
		online: (n: number, total: number) => `${String(n)} de ${String(total)} online agora`,
		noTeam: "Você ainda não tem equipe",
		km: "Km coletivos",
		points: "Pontos",
		invite: "Convidar",
		action: "Ver equipe",
		create: "Criar ou entrar numa equipe",
	},
	pro: "PRO",
	open: "Abrir",
	unlock: "Ver como é",
} as const;

// Prévias dos recursos do Pro no card: miniaturas das telas de verdade
export const PRO_PREVIEW = {
	greeting: (name: string) =>
		name
			? `Oi, ${name}! Pergunta o que quiser das suas corridas.`
			: "Oi! Pergunta o que quiser das suas corridas.",
	questions: [
		"Como foi minha semana de corrida?",
		"Estou evoluindo?",
		"Como posso melhorar meu pace?",
	],
	waterTitle: "Sua água de hoje",
	waterHint: "Toque num copo para registrar",
	cups: ["150 ml", "250 ml", "350 ml", "500 ml"],
	thisWeek: "ESTA SEMANA",
	weeks: "Últimas 8 semanas",
	studioAccessories: [
		{ id: "fone", name: "Fone" },
		{ id: "viseira", name: "Viseira" },
		{ id: "faixaNeon", name: "Faixa neon" },
		{ id: "espelhado", name: "Óculos espelhado" },
		{ id: "mago", name: "Mago" },
		{ id: "samurai", name: "Samurai" },
	],
} as const;

// Atalhos do PACE TEAM PRO (liberados só com o Pro; sem ele, a apresentação)
export const PRO_COPY: Record<IProSectionId, { title: string; subtitle: string; text: string }> = {
	ai: {
		title: "PACE AI",
		subtitle: "Seu treinador por texto ou voz",
		text: "O Buddy analisa suas corridas, responde por texto ou voz e ajuda cada um a evoluir.",
	},
	hydration: {
		title: "PACE Hydration",
		subtitle: "Água no ritmo das suas corridas",
		text: "Sua hidratação acompanha seu ritmo, com orientações para a sua rotina. Pergunte também pela Siri.",
	},
	studio: {
		title: "Buddy Studio",
		subtitle: "Visuais exclusivos para o Buddy",
		text: "Skins, efeitos e visuais exclusivos para o Buddy. O que você ganha correndo continua seu.",
	},
	analytics: {
		title: "Team Analytics",
		subtitle: "O desempenho da equipe",
		text: "Relatórios do desempenho coletivo: evolução, participação e quanto falta para a rival.",
	},
};
