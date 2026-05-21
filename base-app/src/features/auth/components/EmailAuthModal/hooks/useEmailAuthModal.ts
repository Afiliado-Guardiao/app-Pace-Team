import { useState } from "react";
import { Keyboard } from "react-native";

import { useTranslation } from "react-i18next";

import { IEmailAuthErrors, IEmailAuthFormValues, IEmailAuthModalData } from "@/features/auth/types";
import { validateEmailLoginForm, validateEmailRegisterForm } from "@/features/auth/validation";
import { getMyOnboarding, signInWithEmail, signUpWithEmail, updateProfile } from "@/lib/supabase";

interface IUseEmailAuthModalProps {
	onClose: () => void;
	onSuccess: () => void;
}

export const useEmailAuthModal = ({
	onClose,
	onSuccess,
}: IUseEmailAuthModalProps): IEmailAuthModalData => {
	const { t } = useTranslation("auth");
	const [authMode, setAuthMode] = useState<"login" | "register">("login");
	const [formValues, setFormValues] = useState<IEmailAuthFormValues>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<IEmailAuthErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (field: keyof IEmailAuthFormValues, value: string): void => {
		let transformedValue = value;
		if (field === "email") {
			transformedValue = value.toLowerCase().replace(/\s/g, "");
		}
		setFormValues({ ...formValues, [field]: transformedValue });
		if (errors[field]) {
			setErrors({ ...errors, [field]: undefined });
		}
		if (field === "password" && formValues.confirmPassword && authMode === "register") {
			if (transformedValue !== formValues.confirmPassword) {
				setErrors({ ...errors, confirmPassword: t("emailAuth.errors.passwordsMismatch") });
			} else {
				setErrors({ ...errors, confirmPassword: undefined });
			}
		}
	};

	const handleLogin = (): void => {
		const validationErrors = validateEmailLoginForm(formValues.email, formValues.password);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setIsLoading(true);
		signInWithEmail({ email: formValues.email.trim(), password: formValues.password })
			.then(() => {
				onSuccess();
				onClose();
			})
			.catch(() => {
				setErrors({ email: t("emailAuth.errors.invalidCredentials") });
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleRegister = (): void => {
		const validationErrors = validateEmailRegisterForm(
			formValues.name,
			formValues.email,
			formValues.password,
			formValues.confirmPassword,
		);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setIsLoading(true);
		void (async () => {
			try {
				await signUpWithEmail({
					name: formValues.name.trim(),
					email: formValues.email.trim(),
					password: formValues.password,
				});
				// Copia o aniversário capturado no onboarding para o perfil.
				const onboarding = await getMyOnboarding();
				if (onboarding?.birthday) {
					await updateProfile({ birthday: onboarding.birthday });
				}
				onSuccess();
				onClose();
			} catch {
				setErrors({ email: t("emailAuth.errors.registrationFailed") });
			} finally {
				setIsLoading(false);
			}
		})();
	};

	const handleSubmit = (): void => {
		Keyboard.dismiss();
		if (authMode === "login") {
			handleLogin();
		} else {
			handleRegister();
		}
	};

	const toggleAuthMode = (): void => {
		setAuthMode(authMode === "login" ? "register" : "login");
		setErrors({});
		setFormValues({ name: "", email: "", password: "", confirmPassword: "" });
	};

	return {
		authMode,
		formValues,
		errors,
		isLoading,
		handleInputChange,
		handleSubmit,
		toggleAuthMode,
	};
};
