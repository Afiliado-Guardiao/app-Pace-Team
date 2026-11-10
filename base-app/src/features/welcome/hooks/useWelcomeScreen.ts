import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { signInWithAppleNative } from "@/lib/auth/appleSignIn";
import { GOOGLE_SIGN_IN_ENABLED } from "@/lib/auth/providers";
import { useStore } from "@/store";
import { openLegalPage } from "@/constants/legal";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { WELCOME_ROUTES, WELCOME_TOASTS } from "../constants";

type IProvider = "apple" | "google";

interface IUseWelcomeScreenReturn {
	busy: IProvider | null;
	toast: IFloatingToastData | null;
	showCatalogShortcut: boolean;
	handleApple: () => void;
	handleGoogle: () => void;
	// Login com Google ainda não configurado (Google Cloud + Supabase)
	showGoogle: boolean;
	handleEmail: () => void;
	handleTerms: () => void;
	handlePrivacy: () => void;
	handleOpenCatalog: () => void;
}

// Conta criada agora (Apple pela primeira vez): vai para o onboarding
const NEW_ACCOUNT_MS = 10 * 60_000;
const afterSignIn = () => {
	const { user, answers } = useStore.getState();
	const isNew = user ? Date.now() - new Date(user.createdAt).getTime() < NEW_ACCOUNT_MS : false;
	return isNew && answers.setupDone !== "1" ? ROUTES.SETUP : ROUTES.HOME;
};

// Boas-vindas: Apple (nativo + Supabase), Google (em breve) e e-mail.
export const useWelcomeScreen = (): IUseWelcomeScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const [busy, setBusy] = useState<IProvider | null>(null);

	const handleApple = useCallback(() => {
		if (busy) return;
		// Prévia por link: entra direto com os dados de exemplo
		if (IS_PREVIEW) {
			router.replace(ROUTES.HOME);
			return;
		}
		setBusy("apple");
		signInWithAppleNative()
			.then((result) => {
				if (result === "ok") router.replace(afterSignIn());
				if (result === "unavailable") showToast(WELCOME_TOASTS.appleUnavailable);
			})
			.catch(() => {
				showToast(WELCOME_TOASTS.appleError);
			})
			.finally(() => {
				setBusy(null);
			});
	}, [busy, router, showToast]);

	const handleGoogle = useCallback(() => {
		showToast(WELCOME_TOASTS.google);
	}, [showToast]);

	const handleEmail = useCallback(() => {
		router.push(ROUTES.LOGIN);
	}, [router]);

	const handleTerms = useCallback(() => {
		openLegalPage("terms");
	}, []);
	const handlePrivacy = useCallback(() => {
		openLegalPage("privacy");
	}, []);

	const handleOpenCatalog = useCallback(() => {
		router.push(WELCOME_ROUTES.CATALOG);
	}, [router]);

	return {
		busy,
		toast,
		showCatalogShortcut: __DEV__,
		handleApple,
		handleGoogle,
		showGoogle: GOOGLE_SIGN_IN_ENABLED,
		handleEmail,
		handleTerms,
		handlePrivacy,
		handleOpenCatalog,
	};
};
