import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useTeamHandoffStore } from "@/lib/auth/teamHandoffStore";
import { DATA_KEYS } from "@/lib/data";
import { claimTeamHandoff, ITeamHandoffChoice, ITeamHandoffResult } from "@/lib/supabase";

import { HANDOFF_COPY } from "../constants";

export interface IUseTeamHandoffReturn {
	isOpen: boolean;
	isBusy: boolean;
	created: string;
	current: string;
	toast: IFloatingToastData | null;
	move: () => void;
	stay: () => void;
	// Fechar sem escolher: nada muda (a equipe do cadastro fica de fora do ranking)
	dismiss: () => void;
}

const resultMessage = (result: ITeamHandoffResult): string | null => {
	if (result.status === "moved") return HANDOFF_COPY.moved(result.teamName ?? "");
	if (result.status === "stayed") return HANDOFF_COPY.stayed(result.teamName ?? "");
	return null;
};

// Login da Apple caiu na conta antiga: avisa que a equipe do onboarding veio
// junto ou pergunta se o atleta fica na equipe que já tinha.
export const useTeamHandoff = (): IUseTeamHandoffReturn => {
	const client = useQueryClient();
	const pending = useTeamHandoffStore((s) => s.pending);
	const setPending = useTeamHandoffStore((s) => s.setPending);
	const { toast, showToast } = useFloatingToast();
	const [isBusy, setIsBusy] = useState(false);

	const refresh = (): void => {
		for (const key of [DATA_KEYS.myTeam, DATA_KEYS.rankingAll, DATA_KEYS.teamLiveAll]) {
			void client.invalidateQueries({ queryKey: key });
		}
	};
	const announce = (result: ITeamHandoffResult): void => {
		const message = resultMessage(result);
		if (message) showToast({ tone: "success", title: HANDOFF_COPY.toastTitle, message });
	};

	// Sem equipe na conta antiga a equipe já veio: só avisa
	useEffect(() => {
		if (!pending || pending.status === "choose") return;
		setPending(null);
		announce(pending);
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- roda uma vez por resultado
	}, [pending]);

	const choose = (choice: ITeamHandoffChoice): void => {
		if (!pending || isBusy) return;
		setIsBusy(true);
		claimTeamHandoff(pending.token, choice)
			.then((result) => {
				announce(result);
				refresh();
			})
			.catch(() => {
				showToast({ tone: "danger", title: HANDOFF_COPY.toastTitle, message: HANDOFF_COPY.failed });
			})
			.finally(() => {
				setIsBusy(false);
				setPending(null);
			});
	};

	return {
		isOpen: pending?.status === "choose",
		isBusy,
		created: pending?.teamName ?? "",
		current: pending?.currentTeamName ?? "",
		toast,
		move: () => {
			choose("move");
		},
		stay: () => {
			choose("stay");
		},
		dismiss: () => {
			if (!isBusy) setPending(null);
		},
	};
};
