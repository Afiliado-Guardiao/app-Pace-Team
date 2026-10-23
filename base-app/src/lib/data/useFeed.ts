import { useQuery } from "@tanstack/react-query";

import { FEED, IFeedPost } from "@/lib/pace";
import { getFeed } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { toFeedPost } from "./mappers";

const fetchFeed = async (): Promise<IFeedPost[]> => {
	if (IS_PREVIEW) return [...FEED];
	const rows = await getFeed();
	return rows.map(toFeedPost);
};

// Feed das equipes (posts mais recentes primeiro).
export const useFeed = (): { posts: IFeedPost[]; isLoading: boolean } => {
	const query = useQuery({ queryKey: DATA_KEYS.feed, queryFn: fetchFeed, staleTime: 60_000 });
	return { posts: query.data ?? [], isLoading: query.isLoading };
};
