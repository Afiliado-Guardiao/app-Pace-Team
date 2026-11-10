import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData } from "@/components/pace";
import { useMyPro } from "@/lib/data";
import {
	IS_PURCHASES_ENABLED,
	openManageSubscriptions,
	restorePurchases,
	useSubscription,
} from "@/lib/purchases";
import { IMyPro } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";

import { SUBSCRIPTION_COPY } from "../constants";

interface IUseSubscriptionActionsReturn {
	// Gerenciar e restaurar só existem com o RevenueCat ligado
	canManage: boolean;
	// Quem paga uma assinatura vê gerenciar/cancelar
	hasOwnSub: boolean;
	// Equipe PRO, vagas cheias ou Free
	proText: string;
	// "Ativa · renova em 24/11" ou "Cancelada · vale até 24/11" (de quem paga)
	statusText: string;
	isBusy: boolean;
	openPro: () => void;
	manage: () => void;
	restore: () => void;
}

const dayMonth = (iso: string): string => {
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const proTextOf = (pro: IMyPro | null): string => {
	if (pro?.isPro) return `${pro.teamName ?? ""}${SUBSCRIPTION_COPY.teamPro}`;
	if (pro?.teamPro) return SUBSCRIPTION_COPY.overLimit;
	return SUBSCRIPTION_COPY.free;
};

// Perfil › Configurações: PACE TEAM PRO, gerenciar/cancelar e restaurar compras.
export const useSubscriptionActions = (
	showToast: (toast: IFloatingToastData) => void,
): IUseSubscriptionActionsReturn => {
	const router = useRouter();
	const { pro } = useMyPro();
	const { status, refresh } = useSubscription();
	const [isBusy, setIsBusy] = useState(false);

	const until = status?.expiresAt ? dayMonth(status.expiresAt) : "";
	const statusText = !status?.isActive
		? SUBSCRIPTION_COPY.inactive
		: `${status.willRenew ? SUBSCRIPTION_COPY.renews : SUBSCRIPTION_COPY.cancelled}${until}`;

	const restore = useCallback(() => {
		setIsBusy(true);
		restorePurchases()
			.then((s) => {
				showToast(s.isActive ? SUBSCRIPTION_COPY.restored : SUBSCRIPTION_COPY.nothing);
				refresh();
			})
			.catch(() => {
				showToast(SUBSCRIPTION_COPY.error);
			})
			.finally(() => {
				setIsBusy(false);
			});
	}, [refresh, showToast]);

	return {
		canManage: IS_PURCHASES_ENABLED,
		hasOwnSub: Boolean(status?.isActive && IS_PURCHASES_ENABLED),
		proText: proTextOf(pro),
		statusText,
		isBusy,
		openPro: () => {
			router.push(ROUTES.PRO);
		},
		manage: () => {
			openManageSubscriptions().catch(() => {
				showToast(SUBSCRIPTION_COPY.error);
			});
		},
		restore,
	};
};
