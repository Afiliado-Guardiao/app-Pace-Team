import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useMyChallenges } from "@/lib/data";
import { formatKm, formatPace, IMedal, MEDALS } from "@/lib/pace";
import { IMyChallenges } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import {
	CHALLENGE_COPY,
	CHALLENGES_INDIVIDUAL,
	CHALLENGES_TEAM,
	IChallenge,
	MONTHS,
	UNLOCKED,
} from "../constants";

interface IUseChallengesReturn {
	tab: string;
	setTab: (tab: string) => void;
	list: readonly IChallenge[];
	// Aba Equipe sem equipe: aviso no lugar da lista
	emptyNote: string | null;
	unlocked: readonly Pick<IMedal, "icon" | "label" | "color">[];
	goBack: () => void;
}

const WEEK_KM = 40;
const WEEK_RUNS = 5;
const STREAK = 8;
// Cabem 3 medalhas lado a lado em "Desbloqueadas"
const MAX_UNLOCKED = 3;

const individual = (c: IMyChallenges): IChallenge[] => {
	const record = c.previousBest5k;
	const beat = c.best5k !== null && record !== null && c.best5k < record;
	const recordLabel =
		record === null
			? CHALLENGE_COPY.recordFirst
			: `${CHALLENGE_COPY.recordNow}${formatPace(record)}`;
	return [
		{
			icon: "route",
			title: CHALLENGE_COPY.km40,
			value: Math.min(c.weekKm, WEEK_KM),
			max: WEEK_KM,
			valueLabel: `${formatKm(c.weekKm, 1)} / ${String(WEEK_KM)} km`,
			due: CHALLENGE_COPY.endsSunday,
			reward: CHALLENGE_COPY.km40Reward,
		},
		{
			icon: "calendar-check",
			title: CHALLENGE_COPY.runs5,
			value: Math.min(c.weekRuns, WEEK_RUNS),
			max: WEEK_RUNS,
			valueLabel: `${String(c.weekRuns)} / ${String(WEEK_RUNS)}`,
			due: CHALLENGE_COPY.endsSunday,
			reward: CHALLENGE_COPY.runs5Reward,
		},
		{
			icon: "zap",
			title: CHALLENGE_COPY.record,
			value: beat ? 1 : 0,
			max: 1,
			valueLabel:
				beat && c.best5k !== null
					? `${CHALLENGE_COPY.recordNew}${formatPace(c.best5k)}`
					: recordLabel,
			due: MONTHS[new Date().getMonth()] ?? "",
			reward: CHALLENGE_COPY.recordReward,
		},
	];
};

const team = (t: NonNullable<IMyChallenges["team"]>): IChallenge[] => [
	{
		icon: "users",
		title: `${CHALLENGE_COPY.teamKmPrefix}${String(t.goalKm)}${CHALLENGE_COPY.teamKmSuffix}`,
		value: Math.min(t.weekKm, t.goalKm),
		max: t.goalKm,
		valueLabel: `${formatKm(t.weekKm, 0)} / ${String(t.goalKm)} km`,
		due: CHALLENGE_COPY.endsSunday,
		reward: CHALLENGE_COPY.teamKmReward,
	},
	{
		icon: "flag",
		title: CHALLENGE_COPY.streak,
		value: Math.min(t.streak, STREAK),
		max: STREAK,
		valueLabel: `${String(t.streak)} / ${String(STREAK)}${CHALLENGE_COPY.weeks}`,
		due: CHALLENGE_COPY.streakDue,
		reward: CHALLENGE_COPY.streakReward,
	},
];

// 15 Desafios: individuais ou da equipe, com o progresso real das corridas.
export const useChallenges = (): IUseChallengesReturn => {
	const router = useRouter();
	const [tab, setTab] = useState("ind");
	const { challenges } = useMyChallenges();

	const lists = useMemo(() => {
		if (IS_PREVIEW) return { ind: CHALLENGES_INDIVIDUAL, team: CHALLENGES_TEAM };
		return {
			ind: individual(challenges),
			team: challenges.team ? team(challenges.team) : [],
		};
	}, [challenges]);

	const unlocked = useMemo(
		() =>
			IS_PREVIEW
				? UNLOCKED
				: MEDALS.filter((m) => challenges.medals.includes(m.id)).slice(0, MAX_UNLOCKED),
		[challenges.medals],
	);

	return {
		tab,
		setTab,
		list: tab === "ind" ? lists.ind : lists.team,
		emptyNote: tab === "team" && lists.team.length === 0 ? CHALLENGE_COPY.noTeam : null,
		unlocked,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.HOME);
		},
	};
};
