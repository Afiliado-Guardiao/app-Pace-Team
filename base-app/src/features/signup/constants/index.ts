export const SIGNUP_COPY = {
	title: "Criar conta",
	photoTitle: "Foto de perfil",
	photoHint: "Opcional · aparece para sua equipe",
	name: "Nome completo",
	email: "E-mail",
	emailPlaceholder: "voce@email.com",
	password: "Senha",
	passwordHint: "Mínimo de 8 caracteres",
	birthday: "Data de nascimento",
	birthdayPlaceholder: "dd/mm/aaaa",
	birthdayHint: "Necessária para as regras de participação (16+)",
	city: "Cidade",
	state: "Estado",
	termsStart: "Li e aceito os ",
	terms: "Termos de Uso",
	and: " e a ",
	privacy: "Política de Privacidade",
	submit: "Criar conta",
	locationNote: "Pediremos acesso à localização só quando você iniciar sua primeira corrida.",
} as const;

// Listas compartilhadas com o "Editar perfil" (ficam em @/lib/pace)
export { CITIES, STATES } from "@/lib/pace";

export const SIGNUP_TOASTS = {
	photoDenied: {
		tone: "warning",
		title: "Sem acesso às fotos",
		message:
			"Libere o acesso em Ajustes › PACE TEAM › Fotos, ou adicione a foto depois pelo Perfil.",
	},
	error: { tone: "danger", title: "Não deu para criar a conta" },
} as const;
