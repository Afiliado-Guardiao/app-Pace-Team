export const PROFILE_COPY = {
	buddy: "Seu Buddy",
	privacy: "Privacidade",
	settings: "Configurações",
	team: "Pace Sharks",
	role: "Capitão",
	edit: "Editar perfil",
	editSoonTitle: "Editar perfil",
	editSoonMessage: "Foto e dados do perfil entram junto com o cadastro no servidor.",
	runs: "Corridas",
	km: "Km",
	pace: "Ritmo",
	stats: "Estatísticas",
	medals: "Medalhas",
	seeAll: "Ver todas",
	activities: "Atividades",
	history: "Histórico",
	save: "Salvar",
	signOut: "Sair da conta",
	settingsBody: "Você pode entrar de novo quando quiser com o mesmo e-mail ou Apple.",
	close: "Fechar",
} as const;

export const PERIODS = ["Semana", "Mês"] as const;
export const PERIOD_LABELS = {
	Semana: "STQQSSD".split(""),
	Mês: ["S1", "S2", "S3", "S4"],
} as const;

export const NO_TEAM = "Sem equipe";
export const NO_RUNS = "Sua primeira corrida aparece aqui. Toque em Correr no trilho ao lado.";

export const PROFILE_MEDALS = [
	{ icon: "medal", color: "rankGold" },
	{ icon: "mountain", color: "orange400" },
	{ icon: "sunrise", color: "orange300" },
	{ icon: "flame", color: "rankSilver" },
	{ icon: "lock", color: "textDisabled" },
] as const;

export const PRIVACY_SWITCHES = [
	{ label: "Mostrar minha cidade", isOn: true },
	{ label: "Perfil visível fora da equipe", isOn: true },
	{ label: "Compartilhar rotas com a equipe", isOn: false },
	{ label: "Ocultar início e fim das rotas", isOn: true },
] as const;
