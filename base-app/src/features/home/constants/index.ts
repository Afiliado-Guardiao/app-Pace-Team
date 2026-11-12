export const HOME_COPY = {
	greeting: "Bem-vindo de volta!",
	notifications: "Notificações",
	notificationsOffTitle: "Notificações desligadas",
	notificationsOffBody: "Ligue para saber quando a sua equipe estiver online ou correndo.",
	notificationsOffAction: "Ligar",
	weekTitle: "Sua semana",
	weekSubtitle: "Cada km ajuda o time.",
	gaugeLabel: "km de 40",
	onlineOnlyYou: "Só você online",
	onlineAll: "Todos online",
	onlineSuffix: "online",
	pointsA: "Seus",
	pointsB: "pontos",
	teamUnit: "/ cidade",
	noTeamA: "Sua",
	noTeamB: "equipe",
	lastRunTitle: "Última corrida da equipe",
	lastRunNone: "ninguém correu ainda",
	lastRunNoTeam: "Entre numa equipe para começar",
	viradaTitle: "Modo Virada",
	viradaSub: "Modo Virada · vs ",
	viradaNoTeam: "Entre numa equipe para disputar",
	viradaNoRival: "Sem rival na sua cidade ainda",
	feedTitle: "Feed",
	feedTag: "Exemplos fictícios",
	feedEmpty: "Ainda não há corridas postadas. Depois de correr, poste a sua foto para a equipe.",
	feedWith: " com ",
	teamPostBy: "por ",
	like: "Curtir",
} as const;

// Menu "···" do post (denunciar e bloquear: exigência da App Store para feed)
export const POST_MENU_COPY = {
	title: "Opções do post",
	report: "Denunciar post",
	reportTitle: "Por que denunciar?",
	reportBody: "O post some do seu feed agora. Revisamos as denúncias em até 24 horas.",
	block: "Bloquear ",
	remove: "Apagar post",
	removeTitle: "Apagar este post?",
	removeBody: "A foto sai do feed e do seu perfil. Não dá para desfazer.",
	removeConfirm: "Apagar",
	cancel: "Cancelar",
	more: "Mais opções",
	share: "Compartilhar",
	shareText: " correu no PACE TEAM. Corra com a gente: ",
	reported: {
		tone: "success",
		icon: "flag",
		title: "Denúncia enviada",
		message: "Obrigado. Vamos revisar.",
	},
	blocked: {
		tone: "success",
		icon: "ban",
		title: "Atleta bloqueado",
		message: "Os posts desse atleta não aparecem mais para você.",
	},
	removed: { tone: "success", icon: "trash-2", title: "Post apagado" },
	error: { tone: "danger", icon: "alert-circle", title: "Não deu certo agora. Tente de novo." },
} as const;

export const REPORT_REASONS = [
	{ value: "ofensivo", label: "Ofensivo ou discurso de ódio" },
	{ value: "nudez", label: "Nudez ou conteúdo sexual" },
	{ value: "spam", label: "Spam ou propaganda" },
	{ value: "fraude", label: "Corrida falsa (fraude no ranking)" },
	{ value: "outro", label: "Outro motivo" },
] as const;

// Semana do atleta (protótipo): 32,4 de 40 km
export const WEEK_PROGRESS = { km: 32.4, goal: 40, display: "32,4", points: "512", rank: "4º" };

// Pilha de cards do Início (HomeStack): altura, poses e tempos
export const STACK = {
	height: 172,
	extra: 26,
	swipe: 36,
	tap: 8,
	outMs: 220,
	idleMs: 640,
	poseMs: 420,
	freshDelay: 2600,
	shakeEvery: 3200,
	shakeMs: 900,
} as const;

export const STACK_POSES = {
	frontIdle: { x: -5, y: -6, rotate: -3, scale: 1 },
	frontOut: { x: -34, y: -14, rotate: -9, scale: 0.96 },
	backIdle: { x: 7, y: 9, rotate: 2.6, scale: 0.965 },
	backIn: { x: 14, y: 10, rotate: 5, scale: 0.95 },
} as const;

export const DOUBLE_TAP_MS = 320;

// Equipe do onboarding quando o login da Apple cai na conta que o atleta já tinha
export const HANDOFF_COPY = {
	title: (current: string) => `Você já está na equipe ${current}`,
	body: (created: string, current: string) =>
		`No cadastro você criou a equipe ${created}. Quer sair da ${current} e ir para a ${created}? Se você era o capitão, o integrante mais antigo assume. Se ninguém sobrar, a equipe é apagada.`,
	move: (created: string) => `Ir para a ${created}`,
	stay: (current: string) => `Ficar na ${current}`,
	toastTitle: "Equipe",
	moved: (name: string) => `Pronto! Você está na equipe ${name}.`,
	stayed: (name: string) => `Você continua na equipe ${name}.`,
	failed: "Não deu certo agora. Verifique a conexão e tente de novo.",
} as const;
