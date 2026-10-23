// Resultado de exemplo quando não há corrida recente (prévia e histórico)
export const FALLBACK_RESULT = { seconds: 3252, km: 10.58 } as const;
// Pontos provisórios por km (protótipo; a regra final vem do backend)
export const POINTS_PER_KM = 8.1;

export const RUN_SUMMARY_COPY = {
	titleDone: "Corrida concluída",
	titleDetail: "Detalhes da corrida",
	share: "Compartilhar",
	demoMeta: "Hoje · 06:42 · Parque Ibirapuera",
	today: "Hoje · ",
	morning: "Corrida da manhã",
	afternoon: "Corrida da tarde",
	night: "Corrida da noite",
	distance: "Distância",
	totalTime: "Tempo total",
	avgPace: "Ritmo médio",
	avgSpeed: "Velocidade média",
	pointsConfirmed: "Pontos confirmados",
	pointsPending: "Pontos provisórios",
	validated: "Validada",
	reviewing: "Em análise",
	invalid: "Não validada",
	noteInvalid:
		"Distância, tempo ou ritmo fora do padrão de corrida: esta não pontua. Corridas a partir de 1 min e 100 m, até 25 km/h.",
	saveError: "Não deu para salvar agora. Toque em Salvar corrida para tentar de novo.",
	noteValid: "Corrida verificada. Pontos somados para você e para a sua equipe.",
	notePending: "Verificamos GPS, ritmo e sensores antes de somar ao ranking. Leva até 10 minutos.",
	splits: "Parciais",
	save: "Salvar corrida",
	details: "Ver detalhes",
	groupMeta: "Pace Sharks · Hoje, 06:42 · Taquaral",
	groupTitle: "Corrida da equipe",
	groupRan: "5 de 5 correram",
	groupDistance: "Distância da equipe",
	points: "Pontos",
	members: "Integrantes",
	membersHint: "km · ritmo",
	you: "Você",
	groupNote: "Pontos de cada integrante passam por verificação antes de entrar no ranking.",
} as const;
