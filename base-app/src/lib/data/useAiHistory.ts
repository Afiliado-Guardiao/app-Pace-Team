import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	deleteAiConversation,
	IAiConversation,
	IAiMessage,
	listAiConversations,
	listAiMessages,
} from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

interface IUseAiHistoryReturn {
	conversations: IAiConversation[];
	isLoading: boolean;
	remove: (id: string) => void;
	loadMessages: (id: string) => Promise<IAiMessage[]>;
	refresh: () => Promise<unknown>;
}

// Histórico de conversas com a PACE AI (só as do próprio atleta, pela RLS)
export const useAiHistory = (isEnabled: boolean): IUseAiHistoryReturn => {
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: DATA_KEYS.aiConversations,
		queryFn: listAiConversations,
		enabled: isEnabled && !IS_PREVIEW,
		staleTime: 30_000,
	});
	const removal = useMutation({
		mutationFn: deleteAiConversation,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: DATA_KEYS.aiConversations }),
	});

	return {
		conversations: query.data ?? [],
		isLoading: query.isLoading,
		remove: (id) => {
			if (!IS_PREVIEW) removal.mutate(id);
		},
		loadMessages: (id) =>
			IS_PREVIEW
				? Promise.resolve([])
				: queryClient.fetchQuery({
						queryKey: DATA_KEYS.aiMessages(id),
						queryFn: () => listAiMessages(id),
					}),
		refresh: query.refetch,
	};
};
