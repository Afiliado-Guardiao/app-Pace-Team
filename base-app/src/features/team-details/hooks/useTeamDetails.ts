import { useLocalSearchParams, useRouter } from "expo-router";

import {
	ITeamAchievementView,
	ITeamView,
	useMyTeam,
	useTeam,
	useTeamAchievements,
} from "@/lib/data";
import { ROUTES } from "@/constants/routes";

interface IUseTeamDetailsReturn {
	team: ITeamView | null;
	isLoading: boolean;
	achievements: ITeamAchievementView[];
	goBack: () => void;
	openInvite: () => void;
}

// Detalhes da equipe do ranking (?id=) ou da minha equipe.
export const useTeamDetails = (): IUseTeamDetailsReturn => {
	const router = useRouter();
	const params = useLocalSearchParams<{ id?: string }>();
	const mine = useMyTeam();
	const other = useTeam(params.id, mine.team);
	const { achievements } = useTeamAchievements(other.team?.id);

	return {
		team: other.team,
		isLoading: params.id ? other.isLoading : mine.isLoading,
		achievements,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.TEAM);
		},
		openInvite: () => {
			router.push(ROUTES.INVITE);
		},
	};
};
