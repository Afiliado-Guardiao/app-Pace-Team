import { Share } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import {
	ITeamAchievementView,
	ITeamView,
	useMyTeam,
	useTeam,
	useTeamAchievements,
} from "@/lib/data";
import { ROUTES } from "@/constants/routes";

import { INVITE_LINK_BASE, TEAM_DETAILS_COPY } from "../constants";

interface IUseTeamDetailsReturn {
	team: ITeamView | null;
	isLoading: boolean;
	achievements: ITeamAchievementView[];
	// Só o capitão da equipe edita
	canEdit: boolean;
	goBack: () => void;
	openInvite: () => void;
	openEdit: () => void;
	share: () => void;
	// Perfil de um integrante
	openAthlete: (id: string | undefined) => void;
}

// Detalhes da equipe do ranking (?id=) ou da minha equipe.
export const useTeamDetails = (): IUseTeamDetailsReturn => {
	const router = useRouter();
	const params = useLocalSearchParams<{ id?: string }>();
	const mine = useMyTeam();
	const other = useTeam(params.id, mine.team);
	const { achievements } = useTeamAchievements(other.team?.id);
	const team = other.team;

	return {
		team,
		canEdit: Boolean(team?.isCaptain && team.isMine),
		isLoading: params.id ? other.isLoading : mine.isLoading,
		achievements,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.TEAM);
		},
		openInvite: () => {
			router.push(ROUTES.INVITE);
		},
		openAthlete: (id) => {
			if (id) router.push({ pathname: ROUTES.ATHLETE, params: { id } });
		},
		openEdit: () => {
			router.push({ pathname: ROUTES.CREATE_TEAM, params: { edit: "1" } });
		},
		share: () => {
			if (!team) return;
			// Da minha equipe vai o código de convite; de outra, só o nome
			const invite = team.isMine
				? `${TEAM_DETAILS_COPY.shareB}${team.inviteCode} (${INVITE_LINK_BASE}${team.inviteCode})`
				: " no PACE TEAM!";
			void Share.share({ message: `${TEAM_DETAILS_COPY.shareA}${team.name}${invite}` }).catch(
				() => undefined,
			);
		},
	};
};
