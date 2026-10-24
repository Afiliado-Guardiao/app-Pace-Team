export const HOME_COPY = {
	greeting: "Bem-vindo de volta!",
	notifications: "Notificações",
	weekTitle: "Sua semana",
	weekSubtitle: "Cada km ajuda o time.",
	gaugeLabel: "km de 40",
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
	feedTitle: "Feed das equipes",
	feedTag: "Exemplos fictícios",
	feedEmpty: "Ainda não há corridas postadas. Depois de correr, poste a sua foto para a equipe.",
	feedWith: " com ",
	like: "Curtir",
} as const;

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
