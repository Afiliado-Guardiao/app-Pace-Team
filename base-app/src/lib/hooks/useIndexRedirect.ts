import { useCallback } from "react";

import { useFocusEffect, usePathname, useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

// Porta de entrada: logado → Início; já viu a apresentação → boas-vindas;
// primeira vez → abertura (vídeo) e apresentação.
export const useIndexRedirect = (): void => {
	const router = useRouter();
	const pathname = usePathname();

	const hasHydrated = useStore((state) => state._hasHydrated);
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const hasSeenIntro = useStore((state) => state.isCompleted);

	useFocusEffect(
		useCallback(() => {
			if (!hasHydrated || pathname !== "/") return;

			if (isAuthenticated) {
				router.replace(ROUTES.HOME);
				return;
			}

			router.replace(hasSeenIntro ? ROUTES.WELCOME : ROUTES.SPLASH);
		}, [hasHydrated, pathname, isAuthenticated, hasSeenIntro, router]),
	);
};
