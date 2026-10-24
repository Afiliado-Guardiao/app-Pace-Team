import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData } from "@/components/pace";
import { queryClient } from "@/lib/react-query";
import { deleteAccount } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { DELETE_COPY } from "../constants";

// Tempo para a folha anterior sair antes de abrir a próxima (iOS)
const SHEET_SWAP_MS = 350;

interface IUseDeleteAccountReturn {
	isConfirmOpen: boolean;
	isDeleting: boolean;
	// Fecha a folha atual (Configurações) e abre a confirmação depois
	openConfirm: (closeCurrent?: () => void) => void;
	closeConfirm: () => void;
	confirm: () => void;
}

// Excluir conta (exigência da App Store): confirma, apaga tudo e volta ao início.
export const useDeleteAccount = (
	showToast: (toast: IFloatingToastData) => void,
): IUseDeleteAccountReturn => {
	const router = useRouter();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const confirm = useCallback(() => {
		if (IS_PREVIEW) {
			setIsConfirmOpen(false);
			showToast(DELETE_COPY.preview);
			return;
		}
		setIsDeleting(true);
		void deleteAccount()
			.then(() => {
				setIsConfirmOpen(false);
				queryClient.clear();
				router.replace(ROUTES.WELCOME);
			})
			.catch(() => {
				showToast(DELETE_COPY.error);
			})
			.finally(() => {
				setIsDeleting(false);
			});
	}, [router, showToast]);

	return {
		isConfirmOpen,
		isDeleting,
		openConfirm: (closeCurrent) => {
			closeCurrent?.();
			setTimeout(() => {
				setIsConfirmOpen(true);
			}, SHEET_SWAP_MS);
		},
		closeConfirm: () => {
			setIsConfirmOpen(false);
		},
		confirm,
	};
};
