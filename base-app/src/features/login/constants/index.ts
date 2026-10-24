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

// "Esqueci minha senha" com código de 6 dígitos (sem precisar de link)
export const RESET_COPY = {
	title: "Redefinir senha",
	emailBody: "Vamos mandar um código de 6 dígitos para o seu e-mail.",
	email: "E-mail",
	send: "Enviar código",
	codeSentTo: "Digite o código que enviamos para ",
	code: "Código",
	codePlaceholder: "000000",
	newPassword: "Nova senha",
	passwordHint: "Mínimo de 8 caracteres",
	confirm: "Salvar nova senha",
	resend: "Reenviar código",
	emailInvalid: "Digite um e-mail válido.",
	codeInvalid: "Digite os 6 dígitos do código.",
	passwordShort: "A senha precisa ter pelo menos 8 caracteres.",
} as const;

export const LOGIN_TOASTS = {
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
