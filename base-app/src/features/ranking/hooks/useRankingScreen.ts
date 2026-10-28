import { useCallback, useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useMyTeam, useRanking } from "@/lib/data";
import { formatPoints, IRankedTeam } from "@/lib/pace";
import { IRankingScope } from "@/lib/supabase";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { RANKING_COPY, RANKING_SCOPES, WORLD_SCOPE } from "../constants";

const SCOPE_KEYS: Record<string, IRankingScope> = {
	Cidade: "city",
	Região: "region",
	Estado: "state",
	País: "country",
};
const PODIUM_SIZE = 3;
const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

// "Semana 43 · fecha em 4d 2h" (fecha domingo 23:59)
const weekLabel = (now = new Date()): string => {
	const start = new Date(now.getFullYear(), 0, 1);
	const week = Math.ceil(((now.getTime() - start.getTime()) / DAY_MS + start.getDay() + 1) / 7);
	const daysToSunday = (7 - now.getDay()) % 7;
	const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSunday, 23, 59, 59);
	const left = Math.max(0, end.getTime() - now.getTime());
	const days = Math.floor(left / DAY_MS);
	const hours = Math.floor((left % DAY_MS) / HOUR_MS);
	return `${RANKING_COPY.weekPrefix}${String(week)}${RANKING_COPY.closesIn}${String(days)}d ${String(hours)}h`;
};

// 08 Ranking: escopo geográfico, categoria (3/5/10) e regras de pontuação.
export const useRankingScreen = () => {
	const router = useRouter();
	const userCity = useStore((s) => s.user?.city);
	const { team } = useMyTeam();
	const [scope, setScope] = useState<string>(RANKING_SCOPES[0]);
	const [category, setCategory] = useState(String(team?.size ?? 5));
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const isWorld = scope === WORLD_SCOPE;
	const { teams, isLoading } = useRanking(Number(category), SCOPE_KEYS[scope] ?? "city");
	const hasPodium = teams.length >= PODIUM_SIZE;

	const podium = useMemo(
		() =>
			hasPodium
				? teams.slice(0, PODIUM_SIZE).map((t) => ({
						id: t.id,
						name: t.name,
						points: formatPoints(t.points),
						logo: t.logoUrl ?? undefined,
					}))
				: [],
		[teams, hasPodium],
	);

	const openTeam = useCallback(
		(t: Pick<IRankedTeam, "you" | "id">) => {
			if (t.you) router.navigate(ROUTES.TEAM);
			else router.push({ pathname: ROUTES.TEAM_DETAILS, params: t.id ? { id: t.id } : {} });
		},
		[router],
	);

	return {
		scope,
		setScope,
		category,
		setCategory,
		isWorld,
		isLoading,
		isEmpty: !isLoading && teams.length === 0,
		podium,
		rows: hasPodium ? teams.slice(PODIUM_SIZE) : teams,
		firstRowPosition: hasPodium ? PODIUM_SIZE + 1 : 1,
		city: team?.city ?? userCity ?? RANKING_COPY.city,
		week: weekLabel(),
		isRulesOpen,
		openRules: () => {
			setIsRulesOpen(true);
		},
		closeRules: () => {
			setIsRulesOpen(false);
		},
		openTeam,
		openPodium: (name: string) => {
			const picked = teams.find((t) => t.name === name);
			if (picked) openTeam(picked);
		},
	};
};
