import { useCallback } from "react";

import { useFocusEffect, usePathname, useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

// Porta de entrada: logado → Início; primeira vez → onboarding; depois dele,
// a abertura (vídeo) e a apresentação; já viu tudo → boas-vindas.
export const useIndexRedirect = (): void => {
	const router = useRouter();
	const pathname = usePathname();

	const hasHydrated = useStore((state) => state._hasHydrated);
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const hasSeenIntro = useStore((state) => state.isCompleted);
	const isSetupDone = useStore((state) => state.answers.setupDone === "1");

	useFocusEffect(
		useCallback(() => {
			if (!hasHydrated || pathname !== "/") return;

			if (isAuthenticated) {
				router.replace(ROUTES.HOME);
				return;
			}

			// Primeira vez: o onboarding; depois, a abertura de sempre
			if (!isSetupDone) {
				router.replace(ROUTES.SHOWCASE);
				return;
			}
			router.replace(hasSeenIntro ? ROUTES.WELCOME : ROUTES.SPLASH);
		}, [hasHydrated, pathname, isAuthenticated, hasSeenIntro, isSetupDone, router]),
	);
};
