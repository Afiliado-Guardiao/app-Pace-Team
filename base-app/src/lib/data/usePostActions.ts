import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IPublishPostPayload, publishPost, setPostLike } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Publicar no feed e curtir/descurtir (recarrega o feed).
export const usePostActions = () => {
	const client = useQueryClient();
	const refresh = (): void => {
		void client.invalidateQueries({ queryKey: DATA_KEYS.feed });
	};

	const publish = useMutation({
		mutationFn: (payload: IPublishPostPayload) =>
			IS_PREVIEW ? Promise.resolve() : publishPost(payload),
		onSuccess: refresh,
	});
	const like = useMutation({
		mutationFn: (params: { postId: string; liked: boolean }) =>
			IS_PREVIEW ? Promise.resolve() : setPostLike(params.postId, params.liked),
	});

	return { publish, like };
};
