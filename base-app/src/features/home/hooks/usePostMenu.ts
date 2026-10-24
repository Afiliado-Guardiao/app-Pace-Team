import { useCallback, useState } from "react";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { usePostActions } from "@/lib/data";
import { IFeedPost } from "@/lib/pace";
import { IReportReason } from "@/lib/supabase";

import { POST_MENU_COPY } from "../constants";

export type IPostMenuStep = "menu" | "report";

interface IUsePostMenuReturn {
	post: IFeedPost | null;
	step: IPostMenuStep;
	isBusy: boolean;
	toast: IFloatingToastData | null;
	open: (post: IFeedPost) => void;
	close: () => void;
	showReasons: () => void;
	report: (reason: IReportReason) => void;
	block: () => void;
	remove: () => void;
}

// Menu "···" do post: denunciar (com motivo), bloquear o atleta ou apagar o meu.
export const usePostMenu = (): IUsePostMenuReturn => {
	const { report, block, remove } = usePostActions();
	const { toast, showToast } = useFloatingToast();
	const [post, setPost] = useState<IFeedPost | null>(null);
	const [step, setStep] = useState<IPostMenuStep>("menu");

	const close = useCallback(() => {
		setPost(null);
		setStep("menu");
	}, []);

	const done = useCallback(
		(message: IFloatingToastData) => ({
			onSuccess: () => {
				close();
				showToast(message);
			},
			onError: () => {
				showToast(POST_MENU_COPY.error);
			},
		}),
		[close, showToast],
	);

	return {
		post,
		step,
		isBusy: report.isPending || block.isPending || remove.isPending,
		toast,
		open: (next) => {
			setStep("menu");
			setPost(next);
		},
		close,
		showReasons: () => {
			setStep("report");
		},
		report: (reason) => {
			if (post) report.mutate({ postId: post.id, reason }, done(POST_MENU_COPY.reported));
		},
		block: () => {
			if (post?.authorId) block.mutate(post.authorId, done(POST_MENU_COPY.blocked));
		},
		remove: () => {
			if (post) {
				remove.mutate(
					{ postId: post.id, imagePath: post.imagePath ?? null },
					done(POST_MENU_COPY.removed),
				);
			}
		},
	};
};
