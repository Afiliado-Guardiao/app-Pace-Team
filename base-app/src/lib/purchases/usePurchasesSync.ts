import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useStore } from "@/store";

import { configurePurchases, syncPurchasesUser } from "./client";
import { SUBSCRIPTION_KEY } from "./useSubscription";

// Liga o RevenueCat ao atleta logado (login → logIn, logout → logOut) e
// recarrega o status da assinatura a cada troca de conta.
export const usePurchasesSync = (): void => {
	const client = useQueryClient();
	const userId = useStore((s) => s.user?.id ?? null);

	useEffect(() => {
		configurePurchases();
	}, []);

	useEffect(() => {
		syncPurchasesUser(userId)
			.catch(() => undefined)
			.finally(() => {
				void client.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
			});
	}, [userId, client]);
};
