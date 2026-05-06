import { z } from "zod";

export const emailLoginSchema = z.object({
	email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
	password: z.string().min(1, "Senha é obrigatória"),
});

export const emailRegisterSchema = z
	.object({
		name: z.string().min(1, "Nome é obrigatório"),
		email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
		password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type IEmailLoginSchema = z.infer<typeof emailLoginSchema>;
export type IEmailRegisterSchema = z.infer<typeof emailRegisterSchema>;
