export const LOGIN_COPY = {
	title: "Bem-vindo de volta",
	subtitle: "Seu time está esperando por você.",
	email: "E-mail",
	password: "Senha",
	forgot: "Esqueci minha senha",
	submit: "Entrar",
	divider: "ou continue com",
	apple: "Apple",
	google: "Google",
	newHere: "Novo por aqui? ",
	createAccount: "Criar conta",
} as const;

export const LOGIN_TOASTS = {
	resetSent: {
		tone: "success",
		title: "Link enviado",
		message: "Confira seu e-mail para criar uma nova senha.",
	},
	resetError: { tone: "danger", title: "Não deu para enviar o link" },
	appleError: { tone: "danger", title: "Não deu para entrar com Apple" },
	appleUnavailable: {
		tone: "info",
		title: "Login com Apple",
		message: "Disponível no app instalado no iPhone. Use e-mail e senha por enquanto.",
	},
	google: {
		tone: "info",
		title: "Login com Google em breve",
		message: "Use e-mail e senha por enquanto.",
	},
} as const;
