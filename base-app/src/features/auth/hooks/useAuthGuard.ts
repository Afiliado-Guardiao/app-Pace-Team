import { useEffect } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

interface IUseAuthGuardReturn {
	shouldRender: boolean;
}

export const useAuthGuard = (): IUseAuthGuardReturn => {
	const router = useRouter();
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const hasHydrated = useStore((state) => state._hasHydrated);

	useEffect(() => {
		if (!hasHydrated) return;

		if (!isAuthenticated) {
			router.replace(ROUTES.AUTH);
		}
	}, [isAuthenticated, hasHydrated, router]);

	return {
		shouldRender: hasHydrated && isAuthenticated,
	};
};
