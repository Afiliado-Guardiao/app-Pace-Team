import { useState } from "react";

import { useRouter } from "expo-router";

import { ROUTES } from "@/constants/routes";

import { CHALLENGES_INDIVIDUAL, CHALLENGES_TEAM, IChallenge } from "../constants";

interface IUseChallengesReturn {
	tab: string;
	setTab: (tab: string) => void;
	list: readonly IChallenge[];
	goBack: () => void;
}

// 15 Desafios: individuais ou da equipe.
export const useChallenges = (): IUseChallengesReturn => {
	const router = useRouter();
	const [tab, setTab] = useState("ind");

	return {
		tab,
		setTab,
		list: tab === "ind" ? CHALLENGES_INDIVIDUAL : CHALLENGES_TEAM,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.HOME);
		},
	};
};
