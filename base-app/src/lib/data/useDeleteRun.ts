import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRun } from "@/lib/supabase";

import { DATA_KEYS } from "./keys";

// Descarta uma corrida e recarrega histórico, números, equipe e ranking
export const useDeleteRun = () => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: deleteRun,
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: DATA_KEYS.myRuns });
			void client.invalidateQueries({ queryKey: DATA_KEYS.myStats });
			void client.invalidateQueries({ queryKey: DATA_KEYS.myTeam });
			void client.invalidateQueries({ queryKey: DATA_KEYS.rankingAll });
			void client.invalidateQueries({ queryKey: DATA_KEYS.teamLastRuns });
		},
	});
};
