import { useCallback } from "react";

import { useFocusEffect, usePathname, useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

export const useIndexRedirect = () => {
	const router = useRouter();
	const pathname = usePathname();

	const lastRoute = useStore((state) => state.lastRoute);
	const hasHydrated = useStore((state) => state._hasHydrated);
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const isOnboardingCompleted = useStore((state) => state.isCompleted);

	useFocusEffect(
		useCallback(() => {
			if (!hasHydrated) {
				return;
			}

			if (pathname !== "/") {
				return;
			}

			if (isAuthenticated) {
				const targetRoute = lastRoute || ROUTES.HOME;
				router.replace(targetRoute);
				return;
			}

			if (isOnboardingCompleted) {
				router.replace(ROUTES.AUTH);
				return;
			}

			const targetRoute = lastRoute || ROUTES.WELCOME;
			router.replace(targetRoute);
		}, [
			hasHydrated,
			pathname,
			lastRoute,
			isAuthenticated,
			isOnboardingCompleted,
			router,
		]),
	);
};
