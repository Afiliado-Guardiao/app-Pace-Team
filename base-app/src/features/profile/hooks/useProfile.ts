import { useState } from "react";

import { useRouter } from "expo-router";

import { useFloatingToast } from "@/components/pace";
import { useMyChallenges, useMyRuns, useMyStats, useMyTeam } from "@/lib/data";
import { formatKm, formatPace, ME, MEDALS } from "@/lib/pace";
import { queryClient } from "@/lib/react-query";
import { signOut } from "@/lib/supabase/auth";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { NO_TEAM, PERIODS, PROFILE_COPY } from "../constants";

const RECENT_RUNS = 2;
// Cinco círculos: conquistadas primeiro, o resto com cadeado
const MEDAL_SLOTS = 5;
const LOCKED = { icon: "lock", color: "textDisabled" } as const;

type IPeriod = (typeof PERIODS)[number];

// 13 Perfil: período das estatísticas, folhas de privacidade e configurações.
export const useProfile = () => {
	const router = useRouter();
	const user = useStore((s) => s.user);
	const { toast, showToast } = useFloatingToast();
	const [period, setPeriod] = useState<IPeriod>("Semana");
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { stats } = useMyStats();
	const { team } = useMyTeam();
	const { runs } = useMyRuns();
	const { challenges } = useMyChallenges();
	const earned = MEDALS.filter((m) => challenges.medals.includes(m.id)).slice(0, MEDAL_SLOTS);
	const medals = [
		...earned.map((m) => ({ key: m.id, icon: m.icon, color: m.color })),
		...Array.from({ length: MEDAL_SLOTS - earned.length }, (_, i) => ({
			key: `locked-${String(i)}`,
			...LOCKED,
		})),
	];
	const me = team?.members.find((m) => m.you);

	return {
		toast,
		showToast,
		avatarUrl: user?.avatarUrl ?? null,
		name: user?.name || (IS_PREVIEW ? ME.name : "Atleta"),
		handle: user?.handle ? `@${user.handle}` : IS_PREVIEW ? ME.handle : "",
		city: [user?.city, user?.state].filter(Boolean).join(", ") || (IS_PREVIEW ? ME.city : ""),
		team: team?.name ?? NO_TEAM,
		role: me?.role ?? null,
		totals: [
			{ label: PROFILE_COPY.runs, value: String(stats.runs) },
			{ label: PROFILE_COPY.km, value: formatKm(stats.km, 0) },
			{ label: PROFILE_COPY.pace, value: formatPace(stats.avgPace) },
		],
		bars: period === "Mês" ? stats.monthWeeks : stats.weekDays,
		recentRuns: runs.slice(0, RECENT_RUNS),
		medals,
		period,
		setPeriod: (value: string) => {
			setPeriod(value === "Mês" ? "Mês" : "Semana");
		},
		isSettingsOpen,
		openSettings: () => {
			setIsSettingsOpen(true);
		},
		closeSettings: () => {
			setIsSettingsOpen(false);
		},
		handleSignOut: () => {
			setIsSettingsOpen(false);
			queryClient.clear();
			signOut()
				.catch(() => undefined)
				.finally(() => {
					router.replace(ROUTES.WELCOME);
				});
		},
		openChallenges: () => {
			router.push(ROUTES.CHALLENGES);
		},
		openHistory: () => {
			router.push(ROUTES.HISTORY);
		},
		openBuddy: () => {
			router.push(ROUTES.BUDDY);
		},
		openRun: (id: string | number) => {
			router.push({ pathname: ROUTES.RUN_DETAIL, params: typeof id === "string" ? { id } : {} });
		},
	};
};

export type IUseProfileReturn = ReturnType<typeof useProfile>;
