import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { signInWithAppleNative } from "@/lib/auth/appleSignIn";
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
	handleEmail: () => void;
	handleLegal: () => void;
	handleOpenCatalog: () => void;
}

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
				if (result === "ok") router.replace(ROUTES.HOME);
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

	const handleLegal = useCallback(() => {
		showToast(WELCOME_TOASTS.legal);
	}, [showToast]);

	const handleOpenCatalog = useCallback(() => {
		router.push(WELCOME_ROUTES.CATALOG);
	}, [router]);

	return {
		busy,
		toast,
		showCatalogShortcut: __DEV__,
		handleApple,
		handleGoogle,
		handleEmail,
		handleLegal,
		handleOpenCatalog,
	};
};
