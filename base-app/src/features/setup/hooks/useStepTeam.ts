import { useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData } from "@/components/pace";
import { teamErrorMessage, useMyInvites, useTeamActions } from "@/lib/data";
import { IMyInvite } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

interface IUseStepTeamReturn {
	mode: "choose" | "join";
	code: string;
	invites: IMyInvite[];
	isBusy: boolean;
	setCode: (value: string) => void;
	create: () => void;
	openJoin: () => void;
	closeJoin: () => void;
	join: () => void;
	answer: (inviteId: string, accept: boolean) => void;
}

const CODE_LEN = 8;

// 05 · criar a equipe (tela de sempre, com os emblemas), entrar pelo código
// ou aceitar um convite recebido. Com equipe, o fluxo segue sozinho.
export const useStepTeam = (showToast: (t: IFloatingToastData) => void): IUseStepTeamReturn => {
	const router = useRouter();
	const { joinByCode, respond } = useTeamActions();
	const { invites } = useMyInvites();
	const [mode, setMode] = useState<"choose" | "join">("choose");
	const [code, setCodeState] = useState("");

	const fail = (error: unknown) => {
		showToast({ tone: "danger", title: "Equipe", message: teamErrorMessage(error) });
	};

	return {
		mode,
		code,
		// Na prévia por link não há convite de verdade: nada de exemplo aqui
		invites: IS_PREVIEW ? [] : invites,
		isBusy: joinByCode.isPending || respond.isPending,
		setCode: (value) => {
			setCodeState(
				value
					.toUpperCase()
					.replace(/[^A-Z0-9]/g, "")
					.slice(0, CODE_LEN),
			);
		},
		create: () => {
			router.push({ pathname: ROUTES.SETUP_TEAM, params: { from: "setup" } });
		},
		openJoin: () => {
			setMode("join");
		},
		closeJoin: () => {
			setMode("choose");
		},
		join: () => {
			if (code.length < CODE_LEN) return;
			joinByCode.mutate(code, { onError: fail });
		},
		answer: (inviteId, accept) => {
			respond.mutate({ inviteId, accept }, { onError: fail });
		},
	};
};
