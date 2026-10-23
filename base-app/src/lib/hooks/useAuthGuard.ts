import { useEffect } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

interface IUseAuthGuardReturn {
	shouldRender: boolean;
}

// Telas internas só para quem está logado; sem sessão, volta às boas-vindas.
export const useAuthGuard = (): IUseAuthGuardReturn => {
	const router = useRouter();
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const hasHydrated = useStore((state) => state._hasHydrated);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!isAuthenticated && !IS_PREVIEW) router.replace(ROUTES.WELCOME);
	}, [isAuthenticated, hasHydrated, router]);

	return { shouldRender: hasHydrated && (isAuthenticated || IS_PREVIEW) };
};
