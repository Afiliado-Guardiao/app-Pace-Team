import { useCallback, useMemo, useState } from "react";
import { Share } from "react-native";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useMyPro } from "@/lib/data";
import { IPlan, openManageSubscriptions, usePlans } from "@/lib/purchases";
import { IMyPro, linkMyProToTeam } from "@/lib/supabase";
import { openLegalPage } from "@/constants/legal";
import { ROUTES } from "@/constants/routes";

import { PRO_STATUS_COPY, PRO_TOASTS } from "../constants";
import { IProStateKind, proStateOf, savingsOf } from "../utils/proState";

import { useProPurchase } from "./useProPurchase";

interface IUseProScreenReturn {
	pro: IMyPro | null;
	kind: IProStateKind;
	// Só o capitão de uma equipe ainda no Free vê os planos
	showPlans: boolean;
	plans: IPlan[];
	selected: IPlan | null;
	savings: string | null;
	isLoading: boolean;
	isError: boolean;
	toast: IFloatingToastData | null;
	purchase: ReturnType<typeof useProPurchase>;
	select: (planId: string) => void;
	subscribe: () => void;
	retry: () => void;
	goBack: () => void;
	onStatusAction: () => void;
	openTerms: () => void;
	openPrivacy: () => void;
}

// Tela do PACE TEAM PRO: o plano, o status da equipe e a compra (só capitão).
export const useProScreen = (): IUseProScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const { pro, refresh } = useMyPro();
	const { plans, isLoading, isError, retry } = usePlans();
	const purchase = useProPurchase(showToast);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const kind = proStateOf(pro);

	const selected = useMemo(
		() =>
			plans.find((p) => p.id === selectedId) ??
			plans.find((p) => p.period === "annual") ??
			plans.at(0) ??
			null,
		[plans, selectedId],
	);

	const link = useCallback(() => {
		linkMyProToTeam()
			.then(async () => {
				showToast(PRO_TOASTS.linked);
				await refresh();
			})
			.catch(() => {
				showToast(PRO_TOASTS.error);
			});
	}, [refresh, showToast]);

	const onStatusAction = useCallback(() => {
		if (kind === "noTeam") router.push(ROUTES.CREATE_TEAM);
		if (kind === "covered") void openManageSubscriptions().catch(() => undefined);
		if (kind === "memberFree") void Share.share({ message: PRO_STATUS_COPY.memberShare });
		if (kind === "canLink") link();
	}, [kind, router, link]);

	return {
		pro,
		kind,
		showPlans: kind === "captainFree",
		plans,
		selected,
		savings: savingsOf(plans),
		isLoading,
		isError,
		toast,
		purchase,
		select: setSelectedId,
		subscribe: () => {
			if (selected) purchase.subscribe(selected.id);
		},
		retry,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
		onStatusAction,
		openTerms: () => {
			openLegalPage("terms");
		},
		openPrivacy: () => {
			openLegalPage("privacy");
		},
	};
};
