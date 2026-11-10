import { useCallback, useState } from "react";

import { IFloatingToastData } from "@/components/pace";
import { useMyPro } from "@/lib/data";
import { purchasePlan, restorePurchases } from "@/lib/purchases";

import { PRO_TOASTS } from "../constants";

interface IUseProPurchaseReturn {
	isBusy: boolean;
	isConfirming: boolean;
	isDone: boolean;
	subscribe: (planId: string) => void;
	restore: () => void;
	closeDone: () => void;
}

const POLL_MS = 2500;
const POLL_TRIES = 12;
const wait = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});

// Compra do Team Pro: o Pro só libera quando o servidor recebe a confirmação
// da Apple (webhook). Depois de comprar, pergunta ao servidor por até ~30 s.
export const useProPurchase = (
	showToast: (t: IFloatingToastData) => void,
): IUseProPurchaseReturn => {
	const { refresh } = useMyPro();
	const [isBusy, setIsBusy] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const [isDone, setIsDone] = useState(false);

	const confirm = useCallback(async () => {
		setIsConfirming(true);
		for (let i = 0; i < POLL_TRIES; i += 1) {
			const result = (await refresh()) as { data?: { teamPro?: boolean } } | undefined;
			if (result?.data?.teamPro) {
				setIsConfirming(false);
				setIsDone(true);
				return;
			}
			await wait(POLL_MS);
		}
		setIsConfirming(false);
		showToast(PRO_TOASTS.pending);
	}, [refresh, showToast]);

	const subscribe = useCallback(
		(planId: string) => {
			if (isBusy) return;
			setIsBusy(true);
			purchasePlan(planId)
				.then((result) => (result === "purchased" ? confirm() : undefined))
				.catch(() => {
					showToast(PRO_TOASTS.error);
				})
				.finally(() => {
					setIsBusy(false);
				});
		},
		[isBusy, confirm, showToast],
	);

	const restore = useCallback(() => {
		setIsBusy(true);
		restorePurchases()
			.then(async (status) => {
				showToast(status.isActive ? PRO_TOASTS.restored : PRO_TOASTS.nothingToRestore);
				await refresh();
			})
			.catch(() => {
				showToast(PRO_TOASTS.error);
			})
			.finally(() => {
				setIsBusy(false);
			});
	}, [refresh, showToast]);

	return {
		isBusy,
		isConfirming,
		isDone,
		subscribe,
		restore,
		closeDone: () => {
			setIsDone(false);
		},
	};
};
