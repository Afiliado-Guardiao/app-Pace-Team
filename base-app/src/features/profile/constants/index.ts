export const PROFILE_COPY = {
	buddy: "Seu Buddy",
	privacy: "Privacidade",
	settings: "Configurações",
	edit: "Editar perfil",
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
	deleteAccount: "Excluir conta",
} as const;

export const EDIT_COPY = {
	title: "Editar perfil",
	changePhoto: "Trocar foto",
	name: "Nome",
	namePlaceholder: "Seu nome",
	handle: "@usuário",
	handlePlaceholder: "ex.: ana.corre",
	handleHint: "Letras minúsculas, números, ponto ou _ (3 a 20)",
	city: "Cidade",
	state: "Estado",
	save: "Salvar",
	cancel: "Cancelar",
	nameMissing: "Digite seu nome (mínimo 2 letras).",
	handleInvalid: "Use de 3 a 20 letras minúsculas, números, ponto ou _.",
	handleTaken: "Esse @ já está em uso. Escolha outro.",
	saveError: "Não deu para salvar agora. Verifique a conexão e tente de novo.",
	saved: { tone: "success", icon: "check-circle-2", title: "Perfil atualizado" },
	previewSaved: { tone: "info", icon: "info", title: "Na prévia nada é salvo" },
	galleryDenied: {
		tone: "warning",
		icon: "image-off",
		title: "Sem acesso às fotos",
		message: "Libere o acesso em Ajustes › PACE TEAM › Fotos.",
	},
} as const;

export const PRIVACY_COPY = {
	saved: { tone: "success", icon: "shield-check", title: "Privacidade salva" },
	error: { tone: "danger", icon: "alert-circle", title: "Não deu para salvar a privacidade" },
} as const;

export const DELETE_COPY = {
	title: "Excluir conta?",
	body: "Isso apaga para sempre seu perfil, suas corridas, pontos, posts e fotos. Se você for capitão, a capitania passa para o integrante mais antigo. Não dá para desfazer.",
	confirm: "Excluir para sempre",
	cancel: "Cancelar",
	error: {
		tone: "danger",
		icon: "alert-circle",
		title: "Não deu para excluir agora. Tente de novo.",
	},
	preview: { tone: "info", icon: "info", title: "Na prévia a conta não é excluída" },
} as const;

export const PERIODS = ["Semana", "Mês"] as const;
export const PERIOD_LABELS = {
	Semana: "STQQSSD".split(""),
	Mês: ["S1", "S2", "S3", "S4"],
} as const;

export const NO_TEAM = "Sem equipe";
export const NO_RUNS = "Sua primeira corrida aparece aqui. Toque em Correr no trilho ao lado.";

// Padrão do design para quem ainda não salvou a privacidade (igual ao banco)
export const DEFAULT_PRIVACY = {
	showCity: true,
	publicProfile: true,
	shareRoutes: false,
	hideRouteEnds: true,
};

export const PRIVACY_SWITCHES = [
	{ key: "showCity", label: "Mostrar minha cidade" },
	{ key: "publicProfile", label: "Perfil visível fora da equipe" },
	{ key: "shareRoutes", label: "Compartilhar rotas com a equipe" },
	{ key: "hideRouteEnds", label: "Ocultar início e fim das rotas" },
] as const;
