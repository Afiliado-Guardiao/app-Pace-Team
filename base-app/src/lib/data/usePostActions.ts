import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBuddyLive } from "@/lib/buddy/liveStore";
import {
	blockUser,
	deletePost,
	IPublishPostPayload,
	IReportReason,
	publishPost,
	reportPost,
	setPostLike,
} from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Publicar, curtir, denunciar, bloquear e apagar (recarrega o feed).
export const usePostActions = () => {
	const client = useQueryClient();
	const refresh = (): void => {
		void client.invalidateQueries({ queryKey: DATA_KEYS.feed });
	};

	const publish = useMutation({
		mutationFn: (payload: IPublishPostPayload) =>
			IS_PREVIEW ? Promise.resolve() : publishPost(payload),
		onSuccess: () => {
			refresh();
			useBuddyLive.getState().emit("post");
		},
	});
	const like = useMutation({
		mutationFn: (params: { postId: string; liked: boolean }) =>
			IS_PREVIEW ? Promise.resolve() : setPostLike(params.postId, params.liked),
	});

	const report = useMutation({
		mutationFn: (params: { postId: string; reason: IReportReason }) =>
			IS_PREVIEW ? Promise.resolve() : reportPost(params.postId, params.reason),
		onSuccess: refresh,
	});
	const block = useMutation({
		mutationFn: (userId: string) => (IS_PREVIEW ? Promise.resolve() : blockUser(userId)),
		onSuccess: refresh,
	});
	const remove = useMutation({
		mutationFn: (params: { postId: string; imagePath: string | null }) =>
			IS_PREVIEW ? Promise.resolve() : deletePost(params.postId, params.imagePath),
		onSuccess: refresh,
	});

	return { publish, like, report, block, remove };
};
