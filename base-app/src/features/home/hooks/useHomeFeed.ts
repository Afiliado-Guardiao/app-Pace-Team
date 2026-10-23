import { useCallback, useEffect, useMemo, useRef } from "react";
import { LayoutChangeEvent, ScrollView } from "react-native";

import { useFeed } from "@/lib/data";
import { IFeedPost, ME, MY_TEAM, POST_SAMPLE_PHOTOS } from "@/lib/pace";
import { IMyPost, useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

interface IUseHomeFeedReturn {
	posts: readonly IFeedPost[];
	scrollRef: React.RefObject<ScrollView | null>;
	onFeedLayout: (event: LayoutChangeEvent) => void;
}

const SCROLL_DELAY_MS = 650;
const SCROLL_OFFSET = 70;
const JUST_NOW = "agora";

const toFeedPost = (post: IMyPost): IFeedPost => ({
	id: post.id,
	image: post.uri
		? { uri: post.uri }
		: (POST_SAMPLE_PHOTOS[post.sample ?? 0] ?? POST_SAMPLE_PHOTOS[0]),
	art: { seconds: post.seconds, km: post.km, layers: post.layers },
	name: ME.name,
	team: MY_TEAM.name,
	rank: MY_TEAM.rank,
	up: true,
	time: JUST_NOW,
	likes: 0,
	comments: 0,
	caption: post.caption,
});

// Feed do Início: posts do atleta no topo e, logo após publicar, rola até eles.
export const useHomeFeed = (): IUseHomeFeedReturn => {
	const myPosts = useStore((s) => s.myPosts);
	const hasJustPosted = useStore((s) => s.hasJustPosted);
	const setHasJustPosted = useStore((s) => s.setHasJustPosted);
	const scrollRef = useRef<ScrollView>(null);
	const feedY = useRef<number | null>(null);

	const feed = useFeed();
	// Na prévia os posts publicados ficam só no aparelho; no app vêm do Supabase
	const posts = useMemo(
		() => (IS_PREVIEW ? [...myPosts.map(toFeedPost), ...feed.posts] : feed.posts),
		[myPosts, feed.posts],
	);

	const scrollToFeed = useCallback(() => {
		if (feedY.current === null) return;
		scrollRef.current?.scrollTo({ y: Math.max(0, feedY.current - SCROLL_OFFSET), animated: true });
	}, []);

	useEffect(() => {
		if (!hasJustPosted) return;
		const timer = setTimeout(() => {
			scrollToFeed();
			setHasJustPosted(false);
		}, SCROLL_DELAY_MS);
		return () => {
			clearTimeout(timer);
		};
	}, [hasJustPosted, scrollToFeed, setHasJustPosted]);

	const onFeedLayout = useCallback((event: LayoutChangeEvent) => {
		feedY.current = event.nativeEvent.layout.y;
	}, []);

	return { posts, scrollRef, onFeedLayout };
};
