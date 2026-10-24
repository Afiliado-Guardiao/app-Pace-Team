// Mensagens do Supabase Auth traduzidas para o tom do PACE TEAM.
const MESSAGES: { match: RegExp; text: string }[] = [
	{ match: /invalid login credentials/i, text: "E-mail ou senha incorretos." },
	{ match: /email not confirmed/i, text: "Confirme seu e-mail antes de entrar." },
	{
		match: /already registered|already been registered|user already exists/i,
		text: "Esse e-mail já tem conta. Tente entrar.",
	},
	{ match: /password should be at least/i, text: "A senha precisa ter pelo menos 8 caracteres." },
	{ match: /rate limit|too many/i, text: "Muitas tentativas. Espere um pouco e tente de novo." },
	{ match: /network|fetch/i, text: "Sem conexão. Verifique a internet e tente de novo." },
	{
		match: /token has expired|invalid token|otp|expired/i,
		text: "Código inválido ou vencido. Peça um novo código.",
	},
	{
		match: /should be different|same password/i,
		text: "Use uma senha diferente da anterior.",
	},
];

const FALLBACK = "Não deu certo agora. Tente de novo em instantes.";

export const authErrorMessage = (error: unknown): string => {
	const message = error instanceof Error ? error.message : String(error);
	return MESSAGES.find((item) => item.match.test(message))?.text ?? FALLBACK;
};
