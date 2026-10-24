import { useEffect } from "react";

import { useRouter, useSegments } from "expo-router";

import { ROUTES } from "@/constants/routes";

import { IS_PURCHASES_ENABLED } from "./config";
import { useSubscription } from "./useSubscription";

// O app é todo para assinantes: sem assinatura ativa, a área logada mostra a
// tela de assinatura (que também tem restaurar, sair e excluir conta).
// Desligado sem a chave do RevenueCat e na prévia web.
export const usePaywallGate = (): void => {
	const router = useRouter();
	const segments = useSegments();
	const { isActive, isLoading } = useSubscription();
	const isOnPaywall = segments.some((s) => s === "paywall");

	useEffect(() => {
		if (!IS_PURCHASES_ENABLED || isLoading || isActive || isOnPaywall) return;
		router.replace(ROUTES.PAYWALL);
	}, [isActive, isLoading, isOnPaywall, router]);
};
