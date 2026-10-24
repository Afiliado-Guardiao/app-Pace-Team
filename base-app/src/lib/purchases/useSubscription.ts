import { useEffect, useSyncExternalStore } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
	getSubscriptionStatus,
	isPurchasesSynced,
	onSubscriptionChange,
	subscribeToSync,
} from "./client";
import { ISubscriptionStatus } from "./types";

export const SUBSCRIPTION_KEY = ["pace", "subscription"] as const;

interface IUseSubscriptionReturn {
	status: ISubscriptionStatus | null;
	isActive: boolean;
	isLoading: boolean;
	refresh: () => void;
}

// Status da assinatura (RevenueCat), atualizado na hora quando a compra muda.
export const useSubscription = (): IUseSubscriptionReturn => {
	const client = useQueryClient();
	const isSynced = useSyncExternalStore(subscribeToSync, isPurchasesSynced);
	const query = useQuery({
		queryKey: SUBSCRIPTION_KEY,
		queryFn: getSubscriptionStatus,
		enabled: isSynced,
	});

	useEffect(
		() =>
			onSubscriptionChange((status) => {
				client.setQueryData(SUBSCRIPTION_KEY, status);
			}),
		[client],
	);

	return {
		status: query.data ?? null,
		isActive: Boolean(query.data?.isActive),
		isLoading: !isSynced || query.isLoading,
		refresh: () => {
			void query.refetch();
		},
	};
};
