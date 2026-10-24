import { useCallback, useState } from "react";

import { IFloatingToastData } from "@/components/pace";
import {
	IS_PURCHASES_ENABLED,
	openManageSubscriptions,
	restorePurchases,
	useSubscription,
} from "@/lib/purchases";

import { SUBSCRIPTION_COPY } from "../constants";

interface IUseSubscriptionActionsReturn {
	// Esconde a seção sem RevenueCat configurado (desenvolvimento / prévia)
	isVisible: boolean;
	// "Assinatura ativa · renova em 24/11" ou "Cancelada · vale até 24/11"
	statusText: string;
	isBusy: boolean;
	manage: () => void;
	restore: () => void;
}

const dayMonth = (iso: string): string => {
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Perfil › Configurações: ver a assinatura, gerenciar/cancelar e restaurar compras.
export const useSubscriptionActions = (
	showToast: (toast: IFloatingToastData) => void,
): IUseSubscriptionActionsReturn => {
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
		isVisible: IS_PURCHASES_ENABLED,
		statusText,
		isBusy,
		manage: () => {
			openManageSubscriptions().catch(() => {
				showToast(SUBSCRIPTION_COPY.error);
			});
		},
		restore,
	};
};
