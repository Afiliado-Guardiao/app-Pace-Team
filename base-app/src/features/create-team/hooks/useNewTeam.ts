import { useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useMyTeam, useTeamActions } from "@/lib/data";
import { ITeamForm } from "@/lib/supabase";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

export interface ILeaveConfirm {
	isOpen: boolean;
	current: string;
	confirm: () => void;
	close: () => void;
}

interface IUseNewTeamOptions {
	fail: (error: unknown) => void;
	// Envia o escudo depois que a equipe existe e segue para o próximo passo
	finish: (teamId: string | undefined, next: () => void) => void;
}

interface IUseNewTeamReturn {
	submit: (form: ITeamForm) => void;
	isPending: boolean;
	leave: ILeaveConfirm;
}

// Criar a equipe. Quem já está numa equipe confirma antes que vai sair dela
// (o servidor sai e cria no mesmo passo).
export const useNewTeam = ({ fail, finish }: IUseNewTeamOptions): IUseNewTeamReturn => {
	const router = useRouter();
	const params = useLocalSearchParams<{ from?: string }>();
	const setAnswer = useStore((s) => s.setAnswer);
	const { team } = useMyTeam();
	const { create } = useTeamActions();
	const [held, setHeld] = useState<ITeamForm | null>(null);

	const afterCreate = (form: ITeamForm): void => {
		// Veio do onboarding: volta para ele, já na tela de convites
		if (params.from === "setup") {
			setAnswer("setupStep", "invites");
			setAnswer("setupSolo", "");
			setAnswer("setupTeamName", form.name);
			setAnswer("setupTeamSize", String(form.size));
			router.back();
			return;
		}
		router.replace(ROUTES.INVITE);
	};

	const run = (form: ITeamForm, leave: boolean): void => {
		create.mutate(
			{ ...form, leave },
			{
				onSuccess: (id) => {
					finish(id, () => {
						afterCreate(form);
					});
				},
				onError: fail,
			},
		);
	};

	return {
		submit: (form) => {
			if (team) setHeld(form);
			else run(form, false);
		},
		isPending: create.isPending,
		leave: {
			isOpen: held !== null,
			current: team?.name ?? "",
			confirm: () => {
				if (held) run(held, true);
				setHeld(null);
			},
			close: () => {
				setHeld(null);
			},
		},
	};
};
