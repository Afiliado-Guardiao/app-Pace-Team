import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { GlassSurface, Icon, useEntrance } from "@/components/pace";
import { POST_ART_RATIO, PostArt } from "@/components/shared/PostArt";
import { useTheme } from "@/theme";
import { IFeedPost } from "@/lib/pace";

import { HOME_COPY, POST_MENU_COPY } from "../../constants";
import { useFeedPost } from "../../hooks/useFeedPost";
import { FeedPostHeader } from "../FeedPostHeader";

import { createFeedPostStyles } from "./styles";

interface IFeedPostProps {
	post: IFeedPost;
	index: number;
	// Abre o menu "···" (denunciar, bloquear ou apagar)
	onMore: (post: IFeedPost) => void;
}

const ENTRY_STAGGER = 80;
const ACTION_ICON = 21;
const HEART_BIG = 84;

// Post do feed: autor, posição do time, foto (dois toques curtem) e ações.
export const FeedPost: React.FC<IFeedPostProps> = ({ post, index, onMore }) => {
	const { theme } = useTheme();
	const { colors } = theme.pace;
	const feed = useFeedPost(post);
	const entrance = useEntrance("rise", { delay: index * ENTRY_STAGGER, duration: 500 });
	const styles = createFeedPostStyles(theme, post.art ? POST_ART_RATIO : feed.aspectRatio);
	const firstName = post.name.split(" ")[0] ?? post.name;

	return (
		<Animated.View style={[styles.post, entrance]}>
			<FeedPostHeader
				post={post}
				onOpen={feed.openAuthor}
				onMore={() => {
					onMore(post);
				}}
			/>
			<Pressable onPress={feed.handleImageTap} accessibilityLabel={`Corrida de ${post.team}`}>
				<GlassSurface
					appearance={styles.imageAppearance}
					radius={theme.pace.radii.xl}
					style={styles.imageBox}
					backdrop={() =>
						post.art ? (
							<PostArt
								image={post.image}
								seconds={post.art.seconds}
								km={post.art.km}
								layers={post.art.layers}
								team={
									post.team
										? { name: post.team, rank: post.rank, isUp: post.up, logoUrl: post.teamLogo }
										: null
								}
								track={post.art.route ? { route: post.art.route, crew: [] } : undefined}
							/>
						) : (
							<Image source={post.image} style={styles.image} accessibilityIgnoresInvertColors />
						)
					}
				>
					<Animated.View style={[styles.heart, feed.heartStyle]} pointerEvents="none">
						<Icon name="heart" size={HEART_BIG} color={colors.ink.white} fill={colors.ink.white} />
					</Animated.View>
				</GlassSurface>
			</Pressable>
			<View style={styles.actions}>
				<Pressable
					style={styles.action}
					onPress={feed.toggleLike}
					accessibilityRole="button"
					accessibilityLabel={HOME_COPY.like}
				>
					<Icon
						name="heart"
						size={ACTION_ICON}
						color={feed.liked ? colors.orange[500] : colors.ink.white}
						fill={feed.liked ? colors.orange[500] : "none"}
					/>
					<Text style={[styles.count, feed.liked ? styles.countLiked : null]}>{feed.likes}</Text>
				</Pressable>
				<Pressable
					onPress={feed.share}
					hitSlop={8}
					accessibilityRole="button"
					accessibilityLabel={POST_MENU_COPY.share}
					testID={`feed-post-share-${post.id}`}
				>
					<Icon name="send" size={20} />
				</Pressable>
			</View>
			<Text style={styles.caption}>
				<Text style={styles.captionName}>{firstName}</Text> {post.caption}
			</Text>
		</Animated.View>
	);
};
