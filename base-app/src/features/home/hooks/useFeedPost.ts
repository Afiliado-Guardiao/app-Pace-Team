import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Share } from "react-native";

import { useRouter } from "expo-router";

import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { useBuddyLive } from "@/lib/buddy";
import { buildRunCrew, fromStoredCrew, IRunCrewPin, usePostActions } from "@/lib/data";
import { formatKm, IFeedPost } from "@/lib/pace";
import { LEGAL_URLS } from "@/constants/legal";
import { ROUTES } from "@/constants/routes";

import { DOUBLE_TAP_MS, POST_MENU_COPY } from "../constants";

interface IUseFeedPostReturn {
	liked: boolean;
	likes: number;
	aspectRatio: number;
	heartStyle: ReturnType<typeof useAnimatedStyle>;
	toggleLike: () => void;
	handleImageTap: () => void;
	share: () => void;
	// Perfil do autor (ou a equipe, nos posts da equipe)
	openAuthor: () => void;
	// Desenho do percurso com as fotos redondas (o mesmo da tela de postar)
	track?: { route: readonly (readonly [number, number])[]; crew: IRunCrewPin[] };
}

const FALLBACK_RATIO = 4 / 5;
const HEART_MS = 800;

// Curtir pelo botão ou com dois toques na foto (coração "pula" no centro).
// Posts reais (isLiked definido) gravam a curtida no Supabase.
export const useFeedPost = (post: IFeedPost): IUseFeedPostReturn => {
	const router = useRouter();
	const { image } = post;
	const isReal = post.isLiked !== undefined;
	const baseLikes = post.likes - (post.isLiked ? 1 : 0);
	const { like } = usePostActions();
	const [liked, setLiked] = useState(Boolean(post.isLiked));
	const lastTap = useRef(0);
	const heart = useSharedValue(0);
	const asset = typeof image === "number" ? Image.resolveAssetSource(image) : null;
	const aspectRatio = asset?.width && asset.height ? asset.width / asset.height : FALLBACK_RATIO;

	const pop = useCallback(() => {
		heart.value = 0;
		heart.value = withSequence(
			withTiming(1, { duration: HEART_MS * 0.3, easing: Easing.out(Easing.back(2)) }),
			withTiming(1, { duration: HEART_MS * 0.4 }),
			withTiming(2, { duration: HEART_MS * 0.3 }),
		);
	}, [heart]);

	const toggleLike = useCallback(() => {
		const next = !liked;
		if (next) {
			pop();
			useBuddyLive.getState().emit("like");
		}
		setLiked(next);
		if (isReal) like.mutate({ postId: post.id, liked: next });
	}, [liked, pop, isReal, like, post.id]);

	const handleImageTap = useCallback(() => {
		const now = Date.now();
		if (now - lastTap.current < DOUBLE_TAP_MS && !liked) toggleLike();
		lastTap.current = now;
	}, [liked, toggleLike]);

	useEffect(
		() => () => {
			lastTap.current = 0;
		},
		[],
	);

	const heartStyle = useAnimatedStyle(() => {
		const p = heart.value;
		const visible = p > 0 && p < 2;
		return {
			opacity: visible ? Math.min(1, p <= 1 ? p : 2 - p) : 0,
			transform: [{ scale: p <= 1 ? 0.3 + 0.7 * p : 1 }, { translateY: p > 1 ? -(p - 1) * 20 : 0 }],
		};
	});

	// Corrida em equipe: todos que correram, como o servidor tem agora (o
	// percurso de cada um e quem ainda corria já com os números finais).
	// Posts antigos/solo: o desenho guardado; sem fotos guardadas, a do autor.
	const track = useMemo(() => {
		const route = post.art?.route;
		const runners = post.art?.runners ?? [];
		if (runners.length > 1) {
			const owner = { name: post.name, photo: post.avatarUrl ?? null, route: route ?? [] };
			return buildRunCrew(owner, runners);
		}
		if (!route) return undefined;
		const stored = post.art?.crew ?? [];
		const author: IRunCrewPin[] = post.avatarUrl
			? [{ image: { uri: post.avatarUrl }, name: post.name, at: 1 }]
			: [];
		return { route, crew: stored.length > 0 ? fromStoredCrew(stored) : author };
	}, [post.art, post.avatarUrl, post.name]);

	return {
		liked,
		likes: baseLikes + (liked ? 1 : 0),
		track,
		aspectRatio,
		heartStyle,
		toggleLike,
		handleImageTap,
		// Compartilhar pelo menu do iPhone (WhatsApp, Instagram, mensagens...)
		share: () => {
			const km = post.art ? ` ${formatKm(post.art.km, 1)} km` : "";
			void Share.share({
				message: `${post.name}${km}${POST_MENU_COPY.shareText}${LEGAL_URLS.support}`,
			}).catch(() => undefined);
		},
		openAuthor: () => {
			if (post.isTeamPost && post.teamId) {
				router.push({ pathname: ROUTES.TEAM_DETAILS, params: { id: post.teamId } });
			} else if (post.authorId) {
				router.push({ pathname: ROUTES.ATHLETE, params: { id: post.authorId } });
			}
		},
	};
};
