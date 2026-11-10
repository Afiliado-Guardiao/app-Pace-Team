import { useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useFloatingToast } from "@/components/pace";
import { useBuddyStore } from "@/lib/buddy/store";
import { useMyTeam } from "@/lib/data";
import { ME } from "@/lib/pace";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import {
	GOALS,
	IGoalId,
	ISetupStep,
	SEGMENT_OF,
	SETUP_ACCESSORIES,
	SETUP_COPY,
	SETUP_KEYS,
} from "../constants";

import { useSetupFlow } from "./useSetupFlow";
import { useStepTeam } from "./useStepTeam";

const isGoal = (v: unknown): v is IGoalId => GOALS.some((g) => g.id === v);

// Onboarding 03–08: etapa atual, objetivo, equipe, medalha e o resumo final
export const useSetupScreen = () => {
	const router = useRouter();
	const flow = useSetupFlow();
	const { toast, showToast } = useFloatingToast();
	const team = useStepTeam(showToast);
	const { team: myTeam } = useMyTeam();
	const user = useStore((s) => s.user);
	const savedGoal = useStore((s) => s.answers[SETUP_KEYS.goal]);
	const setAnswer = useStore((s) => s.setAnswer);
	const [isMedalOpen, setIsMedalOpen] = useState(false);
	const params = useLocalSearchParams<{ step?: string }>();
	const giftId = useBuddyStore((s) => s.gift);

	// Prévia por link: abre direto numa etapa (?step=goal) para os prints
	useEffect(() => {
		if (IS_PREVIEW && params.step) flow.go(params.step as ISetupStep);
	}, [params.step]); // eslint-disable-line react-hooks/exhaustive-deps

	const goal = isGoal(savedGoal) ? savedGoal : null;
	const gift = SETUP_ACCESSORIES.find((a) => a.id === giftId)?.name;
	const chips = [
		gift,
		GOALS.find((g) => g.id === goal)?.title,
		myTeam?.name ?? SETUP_COPY.doneSolo,
	].filter((c): c is string => Boolean(c));

	return {
		step: flow.step,
		segment: SEGMENT_OF[flow.step],
		canBack: flow.step !== "acc" && flow.step !== "done",
		toast,
		team,
		myTeam,
		goal,
		chips,
		name: user?.name ?? (IS_PREVIEW ? ME.name : ""),
		handle: user?.handle ? `@${user.handle}` : IS_PREVIEW ? ME.handle : "",
		isMedalOpen,
		back: flow.back,
		next: flow.next,
		pickGoal: (g: IGoalId) => {
			setAnswer(SETUP_KEYS.goal, g);
		},
		solo: () => {
			flow.go("done");
		},
		openInvite: () => {
			router.push(ROUTES.INVITE);
		},
		finishTeam: () => {
			setIsMedalOpen(true);
		},
		closeMedal: () => {
			setIsMedalOpen(false);
			flow.next();
		},
		openPro: () => {
			router.push(ROUTES.PRO);
			flow.go("done");
		},
		finish: flow.finish,
	};
};
