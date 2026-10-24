import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { signInWithAppleNative } from "@/lib/auth/appleSignIn";
import { authErrorMessage } from "@/lib/auth/authErrors";
import { signInWithEmail } from "@/lib/supabase";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { LOGIN_TOASTS } from "../constants";
import { ILoginErrors, validateLogin } from "../validation";

import { useResetPassword } from "./useResetPassword";

interface IUseLoginScreenReturn {
	email: string;
	password: string;
	errors: ILoginErrors;
	isLoading: boolean;
	toast: IFloatingToastData | null;
	setEmail: (value: string) => void;
	setPassword: (value: string) => void;
	handleSubmit: () => void;
	handleForgot: () => void;
	reset: ReturnType<typeof useResetPassword>;
	handleApple: () => void;
	handleGoogle: () => void;
	handleBack: () => void;
	handleSignup: () => void;
}

// Login por e-mail e senha no Supabase. Sucesso leva ao Início.
export const useLoginScreen = (): IUseLoginScreenReturn => {
	const router = useRouter();
	const setHasTeam = useStore((state) => state.setHasTeam);
	const { toast, showToast } = useFloatingToast();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ILoginErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const reset = useResetPassword();

	const handleSubmit = useCallback(() => {
		const found = validateLogin({ email, password });
		setErrors(found);
		if (Object.keys(found).length > 0 || isLoading) return;
		setIsLoading(true);
		signInWithEmail({ email: email.trim(), password })
			.then(() => {
				setHasTeam(true);
				router.replace(ROUTES.HOME);
			})
			.catch((error: unknown) => {
				setErrors({ password: authErrorMessage(error) });
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [email, password, isLoading, router, setHasTeam]);

	// Abre a folha de redefinição já com o e-mail digitado no login
	const handleForgot = useCallback(() => {
		reset.open(email);
	}, [email, reset]);

	const handleApple = useCallback(() => {
		signInWithAppleNative()
			.then((result) => {
				if (result === "ok") router.replace(ROUTES.HOME);
				if (result === "unavailable") showToast(LOGIN_TOASTS.appleUnavailable);
			})
			.catch((error: unknown) => {
				showToast({ ...LOGIN_TOASTS.appleError, message: authErrorMessage(error) });
			});
	}, [router, showToast]);

	const handleGoogle = useCallback(() => {
		showToast(LOGIN_TOASTS.google);
	}, [showToast]);

	const handleBack = useCallback(() => {
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.WELCOME);
	}, [router]);

	const handleSignup = useCallback(() => {
		router.push(ROUTES.SIGNUP);
	}, [router]);

	return {
		email,
		password,
		errors,
		isLoading,
		toast,
		setEmail,
		setPassword,
		handleSubmit,
		handleForgot,
		reset,
		handleApple,
		handleGoogle,
		handleBack,
		handleSignup,
	};
};
