export const RUN_REVIEW_COPY = {
	title: "Corrida com o Buddy",
	close: "Fechar",
	distance: "Distância",
	time: "Tempo",
	pace: "Ritmo",
	speed: "Velocidade",
	team: "Ficha da equipe",
	best: "Melhor desempenho",
	you: "Você",
	validate: "Validar corrida",
	understood: "Entendi",
	discard: "Descartar",
	share: "Compartilhar",
	post: "Postar",
	confirmTitle: "Descartar esta corrida?",
	confirmBody: "Ela sai do histórico e os pontos não contam para você nem para a equipe.",
	confirmYes: "Sim, descartar",
	confirmNo: "Voltar",
	invalidNote: "Corrida curta demais para pontuar (mínimo 1 minuto e 100 m).",
} as const;

export const RUN_STATUS_BADGE = {
	valid: { tone: "success", label: "Validada" },
	pending: { tone: "warning", label: "Em análise" },
	invalid: { tone: "danger", label: "Não validada" },
} as const;

// Só avisa corridas recentes (as antigas não aparecem do nada)
export const REVIEW_WINDOW_MS = 12 * 60 * 60 * 1000;
