import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useMyPro } from "@/lib/data";
import { IPlan, usePlans } from "@/lib/purchases";
import { openLegalPage } from "@/constants/legal";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { IProOfferSource } from "./constants";
import { useProOfferStore } from "./offerStore";
import { useProPurchase } from "./useProPurchase";

export interface IUseProOfferReturn {
	source: IProOfferSource | null;
	plans: IPlan[];
	selected: IPlan | null;
	savings: string | null;
	isLoading: boolean;
	isError: boolean;
	isBusy: boolean;
	isConfirming: boolean;
	// Compra confirmada: mostra o "Você agora é PRO!"
	isDone: boolean;
	// Comprou sem equipe: o próximo passo é montar a equipe
	needsTeam: boolean;
	toast: IFloatingToastData | null;
	select: (planId: string) => void;
	subscribe: () => void;
	retry: () => void;
	restore: () => void;
	openTerms: () => void;
	openPrivacy: () => void;
	close: () => void;
	finish: () => void;
}

const savingsOf = (plans: readonly IPlan[]): string | null => {
	const monthly = plans.find((p) => p.period === "monthly");
	const annual = plans.find((p) => p.period === "annual");
	if (!monthly || !annual || monthly.priceValue <= 0) return null;
	const pct = Math.round((1 - annual.priceValue / (monthly.priceValue * 12)) * 100);
	return pct > 0 ? `${String(pct)}%` : null;
};

// Janela do Team Pro: planos com o preço da Apple, compra e o que vem depois
export const useProOffer = (): IUseProOfferReturn => {
	const router = useRouter();
	const source = useProOfferStore((s) => s.source);
	const closeOffer = useProOfferStore((s) => s.close);
	const { toast, showToast } = useFloatingToast();
	const { pro } = useMyPro();
	const { plans, isLoading, isError, retry } = usePlans();
	const purchase = useProPurchase(showToast);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected = useMemo(
		() =>
			plans.find((p) => p.id === selectedId) ??
			plans.find((p) => p.period === "annual") ??
			plans.at(0) ??
			null,
		[plans, selectedId],
	);
	const close = () => {
		purchase.closeDone();
		closeOffer();
	};

	return {
		source,
		plans,
		selected,
		savings: savingsOf(plans),
		isLoading,
		isError,
		isBusy: purchase.isBusy,
		isConfirming: purchase.isConfirming,
		isDone: purchase.isDone,
		needsTeam: !IS_PREVIEW && !pro?.teamId,
		toast,
		select: setSelectedId,
		subscribe: () => {
			if (selected) purchase.subscribe(selected.id);
		},
		retry,
		restore: purchase.restore,
		openTerms: () => {
			openLegalPage("terms");
		},
		openPrivacy: () => {
			openLegalPage("privacy");
		},
		close,
		finish: () => {
			const goTeam = !IS_PREVIEW && !pro?.teamId;
			close();
			if (goTeam) router.push(ROUTES.CREATE_TEAM);
		},
	};
};
