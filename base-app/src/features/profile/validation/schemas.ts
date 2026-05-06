import { z } from "zod";

export const profileUpdateSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	email: z.string().email("Email inválido").optional(),
});

export const passwordChangeSchema = z
	.object({
		currentPassword: z.string().min(1, "Senha atual é obrigatória"),
		newPassword: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type IProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
export type IPasswordChangeSchema = z.infer<typeof passwordChangeSchema>;
