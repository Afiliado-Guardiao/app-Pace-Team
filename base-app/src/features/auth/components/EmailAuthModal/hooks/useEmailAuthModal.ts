import { useState } from "react";
import { Keyboard } from "react-native";

import { useTranslation } from "react-i18next";

import {
	IEmailAuthErrors,
	IEmailAuthFormValues,
	IEmailAuthModalData,
	IEmailAuthResponse,
} from "@/features/auth/types";
import { validateEmailLoginForm, validateEmailRegisterForm } from "@/features/auth/validation";
import { authApi } from "@/lib/api/auth";
import { onboardingApi } from "@/lib/api/onboarding";
import { useStore } from "@/store";

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

	const login = useStore((state) => state.login);
	const onboardingId = useStore((state) => state.onboardingId);
	const setOnboardingId = useStore((state) => state.setOnboardingId);
	const getOrGenerateAnonymousUserId = useStore((state) => state.getOrGenerateAnonymousUserId);

	const handleInputChange = (field: keyof IEmailAuthFormValues, value: string) => {
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
				setErrors({
					...errors,
					confirmPassword: t("emailAuth.errors.passwordsMismatch"),
				});
			} else {
				setErrors({ ...errors, confirmPassword: undefined });
			}
		}
	};

	const handleLogin = () => {
		const validationErrors = validateEmailLoginForm(formValues.email, formValues.password);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setIsLoading(true);
		authApi
			.loginWithEmail({ email: formValues.email.trim(), password: formValues.password })
			.then((response: IEmailAuthResponse) => {
				login(response.user, response.token);
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
	const handleRegister = () => {
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
				let currentOnboardingId = onboardingId;
				if (!currentOnboardingId) {
					const anonymousUserId = getOrGenerateAnonymousUserId();
					const { id } = await onboardingApi.createOnboarding(anonymousUserId);
					setOnboardingId(id);
					currentOnboardingId = id;
				}
				const response = await authApi.register({
					name: formValues.name.trim(),
					email: formValues.email.trim(),
					password: formValues.password,
					onboardingId: currentOnboardingId,
				});
				login(response.user, response.token);
				onSuccess();
				onClose();
			} catch {
				setErrors({ email: t("emailAuth.errors.registrationFailed") });
			} finally {
				setIsLoading(false);
			}
		})();
	};
	const handleSubmit = () => {
		Keyboard.dismiss();
		if (authMode === "login") {
			handleLogin();
		} else {
			handleRegister();
		}
	};

	const toggleAuthMode = () => {
		setAuthMode(authMode === "login" ? "register" : "login");
		setErrors({});
		setFormValues({
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		});
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
