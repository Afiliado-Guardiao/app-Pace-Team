import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { IPlan, purchasePlan, restorePurchases, usePlans, useSubscription } from "@/lib/purchases";
import { queryClient } from "@/lib/react-query";
import { deleteAccount, signOut } from "@/lib/supabase";
import { openLegalPage } from "@/constants/legal";
import { ROUTES } from "@/constants/routes";

import { PAYWALL_TOASTS } from "../constants";

interface IUsePaywallScreenReturn {
	plans: IPlan[];
	selected: IPlan | null;
	// "42%" que o anual economiza frente a 12 meses do mensal
	savings: string | null;
	isLoading: boolean;
	isError: boolean;
	isBusy: boolean;
	isDeleteOpen: boolean;
	toast: IFloatingToastData | null;
	select: (planId: string) => void;
	subscribe: () => void;
	restore: () => void;
	retry: () => void;
	openTerms: () => void;
	openPrivacy: () => void;
	signOut: () => void;
	openDelete: () => void;
	closeDelete: () => void;
	confirmDelete: () => void;
}

const savingsOf = (plans: readonly IPlan[]): string | null => {
	const monthly = plans.find((p) => p.period === "monthly");
	const annual = plans.find((p) => p.period === "annual");
	if (!monthly || !annual || monthly.priceValue <= 0) return null;
	const pct = Math.round((1 - annual.priceValue / (monthly.priceValue * 12)) * 100);
	return pct > 0 ? `${String(pct)}%` : null;
};

// Tela de assinatura: escolher plano, assinar, restaurar e (Apple) sair/excluir.
export const usePaywallScreen = (): IUsePaywallScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const { plans, isLoading, isError, retry } = usePlans();
	const { isActive, refresh } = useSubscription();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isBusy, setIsBusy] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	// Assinou (aqui ou em outro aparelho): segue para o app
	useEffect(() => {
		if (isActive) router.replace(ROUTES.HOME);
	}, [isActive, router]);

	const selected = useMemo(
		() =>
			plans.find((p) => p.id === selectedId) ??
			plans.find((p) => p.period === "annual") ??
			plans.at(0) ??
			null,
		[plans, selectedId],
	);

	const run = useCallback(
		(task: () => Promise<void>) => {
			setIsBusy(true);
			task()
				.catch(() => {
					showToast(PAYWALL_TOASTS.error);
				})
				.finally(() => {
					setIsBusy(false);
				});
		},
		[showToast],
	);

	const subscribe = useCallback(() => {
		if (!selected || isBusy) return;
		run(async () => {
			const result = await purchasePlan(selected.id);
			if (result === "purchased") refresh();
		});
	}, [selected, isBusy, run, refresh]);

	const restore = useCallback(() => {
		run(async () => {
			const status = await restorePurchases();
			showToast(status.isActive ? PAYWALL_TOASTS.restored : PAYWALL_TOASTS.nothingToRestore);
			refresh();
		});
	}, [run, showToast, refresh]);

	const leave = useCallback(() => {
		queryClient.clear();
		router.replace(ROUTES.WELCOME);
	}, [router]);

	return {
		plans,
		selected,
		savings: savingsOf(plans),
		isLoading,
		isError,
		isBusy,
		isDeleteOpen,
		toast,
		select: setSelectedId,
		subscribe,
		restore,
		retry,
		openTerms: () => {
			openLegalPage("terms");
		},
		openPrivacy: () => {
			openLegalPage("privacy");
		},
		signOut: () => {
			void signOut().finally(leave);
		},
		openDelete: () => {
			setIsDeleteOpen(true);
		},
		closeDelete: () => {
			setIsDeleteOpen(false);
		},
		confirmDelete: () => {
			run(async () => {
				await deleteAccount();
				setIsDeleteOpen(false);
				leave();
			});
		},
	};
};
