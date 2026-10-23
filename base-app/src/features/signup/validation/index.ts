import { z } from "zod";

const MIN_AGE = 16;
const BIRTHDAY = /^(\d{2})\/(\d{2})\/(\d{4})$/;

// dd/mm/aaaa válido e com 16 anos ou mais (regra de participação)
const isOldEnough = (value: string, today = new Date()): boolean => {
	const match = BIRTHDAY.exec(value);
	if (!match) return false;
	const [, dd = "", mm = "", yyyy = ""] = match;
	const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
	if (date.getDate() !== Number(dd) || date.getMonth() !== Number(mm) - 1) return false;
	const limit = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
	return date <= limit;
};

export const signupSchema = z.object({
	name: z.string().trim().min(2, "Digite seu nome."),
	email: z.string().trim().email("Digite um e-mail válido."),
	password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
	birthday: z
		.string()
		.regex(BIRTHDAY, "Use o formato dd/mm/aaaa.")
		.refine((value) => isOldEnough(value), "É preciso ter 16 anos ou mais."),
	city: z.string().min(1),
	state: z.string().min(1),
});

export type ISignupForm = z.infer<typeof signupSchema>;
export type ISignupErrors = Partial<Record<keyof ISignupForm, string>>;

export const validateSignup = (form: ISignupForm): ISignupErrors => {
	const result = signupSchema.safeParse(form);
	if (result.success) return {};
	const errors: ISignupErrors = {};
	for (const issue of result.error.issues) {
		const key = issue.path[0] as keyof ISignupForm;
		errors[key] ??= issue.message;
	}
	return errors;
};

// Máscara da data: só dígitos, com barras automáticas
export const maskBirthday = (text: string): string => {
	const digits = text.replace(/\D/g, "").slice(0, 8);
	const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
	return parts.join("/");
};

// dd/mm/aaaa → aaaa-mm-dd (formato salvo no perfil)
export const toIsoDate = (value: string): string => {
	const [dd = "", mm = "", yyyy = ""] = value.split("/");
	return `${yyyy}-${mm}-${dd}`;
};
