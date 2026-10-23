import { useCallback } from "react";

import { useRouter } from "expo-router";

import { TAB_ROUTES } from "@/constants/routes";

// Para telas fora das abas que mostram o trilho (Modo Virada, Mapa).
export const useTabRail = (): ((tabId: string) => void) => {
	const router = useRouter();

	return useCallback(
		(tabId: string) => {
			const route = TAB_ROUTES[tabId];
			if (route) router.navigate(route);
		},
		[router],
	);
};
