import { useCallback } from "react";

import { useFocusEffect, useRouter } from "expo-router";

import { useMyPro, useMyTeam } from "@/lib/data";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { ISetupStep, SETUP_KEYS, SETUP_STEPS } from "../constants";

interface IUseSetupFlowReturn {
	step: ISetupStep;
	hasTeam: boolean;
	go: (step: ISetupStep) => void;
	next: () => void;
	back: () => void;
	finish: () => void;
}

const isStep = (value: unknown): value is ISetupStep => SETUP_STEPS.includes(value as ISetupStep);

// Onboarding depois da conta: a etapa fica salva no aparelho (fechou o app,
// volta nela). Quem já tem equipe pula a escolha; o Team Pro é pulado se a
// equipe já é PRO ou se o atleta não é o capitão.
export const useSetupFlow = (): IUseSetupFlowReturn => {
	const router = useRouter();
	const saved = useStore((s) => s.answers[SETUP_KEYS.step]);
	const setAnswer = useStore((s) => s.setAnswer);
	const isLogged = useStore((s) => s.isAuthenticated);
	const { team } = useMyTeam();
	const { pro } = useMyPro();
	const step: ISetupStep = isStep(saved) ? saved : "profile";
	const hasTeam = Boolean(team);

	const go = useCallback(
		(target: ISetupStep) => {
			setAnswer(SETUP_KEYS.step, target);
		},
		[setAnswer],
	);

	const skipPro = !pro?.isCaptain || pro.teamPro;
	const next = useCallback(() => {
		const after = SETUP_STEPS[SETUP_STEPS.indexOf(step) + 1] ?? "done";
		if (after === "invites" && !hasTeam) go("done");
		else if (after === "pro" && skipPro) go("done");
		else go(after);
	}, [step, hasTeam, skipPro, go]);

	// Voltou da tela "Criar equipe" (ou "Convidar") já com equipe: segue
	useFocusEffect(
		useCallback(() => {
			// (na prévia por link a equipe de exemplo já existe: fica na tela)
			if (step === "team" && hasTeam && !IS_PREVIEW) go("invites");
		}, [step, hasTeam, go]),
	);

	return {
		step,
		hasTeam,
		go,
		next,
		back: () => {
			const index = SETUP_STEPS.indexOf(step);
			if (index > 0) go(SETUP_STEPS[index - 1]);
		},
		finish: () => {
			setAnswer(SETUP_KEYS.done, "1");
			// Depois do onboarding vem a abertura de sempre (vídeo, fotos e o
			// login com Apple ou e-mail); quem já entrou vai direto ao Início
			router.replace(isLogged ? ROUTES.HOME : ROUTES.SPLASH);
		},
	};
};
