import { useQuery } from "@tanstack/react-query";

import { getTeamAchievements, ITeamAchievements } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

export interface ITeamAchievementView {
	// Prêmio 3D (lib/prizes)
	id: "team_top5" | "team_streak" | "team_km" | "team_record";
	icon: string;
	label: string;
	isUnlocked: boolean;
}

interface IUseTeamAchievementsReturn {
	achievements: ITeamAchievementView[];
	// Já leu do servidor (sem equipe também conta como lido)
	isLoaded: boolean;
}

const STREAK_GOAL = 8;
const KM_GOAL = 1000;

const NONE: ITeamAchievements = { top5: false, maxStreak: 0, totalKm: 0, record: false };
const DEMO: ITeamAchievements = { top5: true, maxStreak: 8, totalKm: 2418, record: true };

// Os quatro selos do design: Top 5, 8 semanas seguidas, 1.000 km e recorde semanal.
const toView = (a: ITeamAchievements): ITeamAchievementView[] => [
	{ id: "team_top5", icon: "medal", label: "Top 5", isUnlocked: a.top5 },
	{ id: "team_streak", icon: "flame", label: "8 sem.", isUnlocked: a.maxStreak >= STREAK_GOAL },
	{ id: "team_km", icon: "mountain", label: "1.000 km", isUnlocked: a.totalKm >= KM_GOAL },
	{ id: "team_record", icon: "zap", label: "Recorde", isUnlocked: a.record },
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
	if (IS_PREVIEW) return { achievements: toView(DEMO), isLoaded: true };
	return { achievements: toView(query.data ?? NONE), isLoaded: !teamId || query.isSuccess };
};
