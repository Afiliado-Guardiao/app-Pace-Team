import { useQuery } from "@tanstack/react-query";

import { getTeamAchievements, ITeamAchievements } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

export interface ITeamAchievementView {
	icon: string;
	label: string;
	isUnlocked: boolean;
}

interface IUseTeamAchievementsReturn {
	achievements: ITeamAchievementView[];
}

const STREAK_GOAL = 8;
const KM_GOAL = 1000;

const NONE: ITeamAchievements = { top5: false, maxStreak: 0, totalKm: 0, record: false };
const DEMO: ITeamAchievements = { top5: true, maxStreak: 8, totalKm: 2418, record: true };

// Os quatro selos do design: Top 5, 8 semanas seguidas, 1.000 km e recorde semanal.
const toView = (a: ITeamAchievements): ITeamAchievementView[] => [
	{ icon: "medal", label: "Top 5", isUnlocked: a.top5 },
	{ icon: "flame", label: "8 sem.", isUnlocked: a.maxStreak >= STREAK_GOAL },
	{ icon: "mountain", label: "1.000 km", isUnlocked: a.totalKm >= KM_GOAL },
	{ icon: "zap", label: "Recorde", isUnlocked: a.record },
];

// Conquistas de uma equipe (Detalhes da equipe).
export const useTeamAchievements = (
	teamId: string | null | undefined,
): IUseTeamAchievementsReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.teamAchievements(teamId ?? "none"),
		queryFn: () => getTeamAchievements(teamId ?? ""),
		enabled: !IS_PREVIEW && Boolean(teamId),
	});
	if (IS_PREVIEW) return { achievements: toView(DEMO) };
	return { achievements: toView(query.data ?? NONE) };
};
