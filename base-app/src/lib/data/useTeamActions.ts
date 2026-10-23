import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeam, inviteToTeam, joinTeamByCode, leaveTeam, respondInvite } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Na prévia por link as ações só fingem dar certo (não há sessão).
const live =
	<A extends unknown[], R>(fn: (...args: A) => Promise<R>) =>
	(...args: A): Promise<R | undefined> =>
		IS_PREVIEW ? Promise.resolve(undefined) : fn(...args);

// Ações de equipe; cada uma recarrega equipe, convites e ranking.
export const useTeamActions = () => {
	const client = useQueryClient();
	const refresh = (): void => {
		void client.invalidateQueries({ queryKey: DATA_KEYS.myTeam });
		void client.invalidateQueries({ queryKey: DATA_KEYS.myInvites });
		void client.invalidateQueries({ queryKey: DATA_KEYS.rankingAll });
	};

	const create = useMutation({ mutationFn: live(createTeam), onSuccess: refresh });
	const joinByCode = useMutation({ mutationFn: live(joinTeamByCode), onSuccess: refresh });
	const leave = useMutation({ mutationFn: live(leaveTeam), onSuccess: refresh });
	const invite = useMutation({ mutationFn: live(inviteToTeam), onSuccess: refresh });
	const respond = useMutation({
		mutationFn: (params: { inviteId: string; accept: boolean }) =>
			live(respondInvite)(params.inviteId, params.accept),
		onSuccess: refresh,
	});

	return { create, joinByCode, leave, invite, respond };
};

// Mensagem amigável para os erros das funções de equipe.
export const teamErrorMessage = (error: unknown): string => {
	const text = error instanceof Error ? error.message : String(error);
	if (text.includes("already_in_team")) return "Você já está em uma equipe. Saia dela antes.";
	if (text.includes("team_full")) return "A equipe já está completa.";
	if (text.includes("team_not_found")) return "Não encontramos essa equipe. Confira o código.";
	if (text.includes("invite_not_found")) return "Esse convite não está mais disponível.";
	if (text.includes("no_team")) return "Crie ou entre em uma equipe para convidar.";
	return "Não deu certo agora. Verifique a conexão e tente de novo.";
};
