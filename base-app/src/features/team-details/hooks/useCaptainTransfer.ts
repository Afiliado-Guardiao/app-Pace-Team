import { useState } from "react";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { ITeamView, teamErrorMessage, useTeamActions } from "@/lib/data";
import { ITeamMember } from "@/lib/pace";

import { TEAM_DETAILS_COPY as C } from "../constants";

export interface IUseCaptainTransferReturn {
	isOpen: boolean;
	isBusy: boolean;
	// Integrantes que podem virar capitão (todos menos você)
	candidates: ITeamMember[];
	// Escolhido, esperando a confirmação
	target: ITeamMember | null;
	toast: IFloatingToastData | null;
	open: () => void;
	close: () => void;
	pick: (member: ITeamMember) => void;
	back: () => void;
	confirm: () => void;
}

// Capitão passa a faixa para outro integrante: escolhe, confirma e pronto
export const useCaptainTransfer = (team: ITeamView | null): IUseCaptainTransferReturn => {
	const { transfer } = useTeamActions();
	const { toast, showToast } = useFloatingToast();
	const [isOpen, setIsOpen] = useState(false);
	const [target, setTarget] = useState<ITeamMember | null>(null);
	const candidates = (team?.members ?? []).filter((m) => !m.you && m.id);

	const close = () => {
		setIsOpen(false);
		setTarget(null);
	};

	return {
		isOpen,
		isBusy: transfer.isPending,
		candidates,
		target,
		toast,
		open: () => {
			setIsOpen(true);
		},
		close,
		pick: setTarget,
		back: () => {
			setTarget(null);
		},
		confirm: () => {
			if (!target?.id) return;
			const name = target.name;
			transfer.mutate(target.id, {
				onSuccess: () => {
					close();
					showToast({ tone: "success", icon: "crown", title: C.captainDone, message: name });
				},
				onError: (error) => {
					showToast({ tone: "danger", title: C.errorTitle, message: teamErrorMessage(error) });
				},
			});
		},
	};
};
