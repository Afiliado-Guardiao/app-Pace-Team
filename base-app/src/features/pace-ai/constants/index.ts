import { IAiErrorCode } from "@/lib/supabase";

export const PACE_AI_COPY = {
	title: "PACE AI",
	history: "Conversas",
	greeting: (name: string) =>
		name
			? `Oi, ${name}! Pergunta o que quiser das suas corridas.`
			: "Oi! Pergunta o que quiser das suas corridas.",
	weekTitle: "Sua semana",
	weekKm: "km",
	weekRuns: "corridas",
	weekPace: "ritmo médio",
	prevWeek: (km: string) => `Semana passada: ${km} km`,
	noRuns: "Nenhuma corrida nesta semana ainda. Bora sair para a primeira?",
	weeksLabel: "Últimas 8 semanas",
	suggestionsTitle: "Perguntas rápidas",
	placeholder: "Pergunte ao Buddy…",
	listening: "Estou ouvindo… pode falar",
	thinking: "Buddy está pensando",
	send: "Enviar pergunta",
	mic: "Falar com o Buddy",
	micStop: "Parar de ouvir",
	speakOn: "Ler as respostas em voz alta",
	speakOff: "Parar de ler as respostas",
	speed: "Velocidade da voz",
	left: (n: number, limit: number) => `Restam ${String(n)} de ${String(limit)} perguntas hoje`,
	disclaimer:
		"A PACE AI usa só as corridas registradas no PACE TEAM. Não substitui médico nem treinador.",
	newChat: "Nova conversa",
	emptyHistory: "Suas conversas com o Buddy aparecem aqui.",
	remove: "Apagar conversa",
	close: "Fechar",
} as const;

export const DAILY_LIMIT = 20;
export const MAX_QUESTION = 500;

// Perguntas rápidas (as do pedido do PACE TEAM PRO)
export const SUGGESTIONS = [
	"Como foi minha semana de corrida?",
	"Estou evoluindo?",
	"Como posso melhorar meu pace?",
	"Qual foi minha melhor corrida?",
	"Quanto corri neste mês?",
	"O que devo focar na próxima semana?",
	"Quem da equipe correu menos esta semana?",
	"Como posso ajudar minha equipe a subir no ranking?",
] as const;

// O que o atleta vê quando a PACE AI não consegue responder
export const AI_ERRORS: Record<IAiErrorCode, { title: string; message: string }> = {
	limit: {
		title: "Limite do dia",
		message: "Você já fez as perguntas de hoje. Amanhã o Buddy volta com tudo!",
	},
	not_pro: {
		title: "PACE TEAM PRO",
		message: "A PACE AI é do Team Pro. Fale com o capitão da sua equipe.",
	},
	not_configured: {
		title: "PACE AI",
		message: "A PACE AI está sendo ligada. Tente de novo daqui a pouco.",
	},
	busy: {
		title: "PACE AI",
		message: "O Buddy está ocupado agora. Tente de novo em alguns segundos.",
	},
	offline: {
		title: "Sem internet",
		message: "Confira a sua conexão e tente de novo.",
	},
};

// Velocidade da leitura em voz alta (como no WhatsApp)
export const VOICE_SPEEDS = [
	{ label: "1x", rate: 1.05 },
	{ label: "1,5x", rate: 1.4 },
	{ label: "2x", rate: 1.75 },
] as const;

export const VOICE_ERRORS = {
	denied: {
		title: "Microfone",
		message: "Libere o microfone e o reconhecimento de fala nos Ajustes do iPhone.",
	},
	unavailable: {
		title: "Voz",
		message: "A conversa por voz não está disponível neste aparelho.",
	},
} as const;
