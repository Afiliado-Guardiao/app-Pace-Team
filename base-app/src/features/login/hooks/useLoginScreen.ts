import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { signInWithAppleNative } from "@/lib/auth/appleSignIn";
import { authErrorMessage } from "@/lib/auth/authErrors";
import { sendPasswordReset, signInWithEmail } from "@/lib/supabase";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { LOGIN_TOASTS } from "../constants";
import { ILoginErrors, validateLogin } from "../validation";

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

	const handleForgot = useCallback(() => {
		const found = validateLogin({ email, password: "-" });
		if (found.email) {
			setErrors({ email: "Digite seu e-mail para receber o link." });
			return;
		}
		sendPasswordReset(email.trim())
			.then(() => {
				showToast(LOGIN_TOASTS.resetSent);
			})
			.catch((error: unknown) => {
				showToast({ ...LOGIN_TOASTS.resetError, message: authErrorMessage(error) });
			});
	}, [email, password, showToast]);

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
		handleApple,
		handleGoogle,
		handleBack,
		handleSignup,
	};
};
