import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().trim().email("Digite um e-mail válido."),
	password: z.string().min(1, "Digite sua senha."),
});

export type ILoginForm = z.infer<typeof loginSchema>;
export type ILoginErrors = Partial<Record<keyof ILoginForm, string>>;

export const validateLogin = (form: ILoginForm): ILoginErrors => {
	const result = loginSchema.safeParse(form);
	if (result.success) return {};
	const errors: ILoginErrors = {};
	for (const issue of result.error.issues) {
		const key = issue.path[0] as keyof ILoginForm;
		errors[key] ??= issue.message;
	}
	return errors;
};
