import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Avatar, GlassSurface, Icon, useEntrance } from "@/components/pace";
import { POST_ART_RATIO, PostArt } from "@/components/shared/PostArt";
import { useTheme } from "@/theme";
import { IFeedPost } from "@/lib/pace";

import { HOME_COPY } from "../../constants";
import { useFeedPost } from "../../hooks/useFeedPost";

import { createFeedPostStyles } from "./styles";

interface IFeedPostProps {
	post: IFeedPost;
	index: number;
}

const ENTRY_STAGGER = 80;
const ACTION_ICON = 21;
const HEART_BIG = 84;

// Post do feed: autor, posição do time, foto (dois toques curtem) e ações.
export const FeedPost: React.FC<IFeedPostProps> = ({ post, index }) => {
	const { theme } = useTheme();
	const { colors } = theme.pace;
	const feed = useFeedPost(post);
	const entrance = useEntrance("rise", { delay: index * ENTRY_STAGGER, duration: 500 });
	const styles = createFeedPostStyles(theme, post.art ? POST_ART_RATIO : feed.aspectRatio);
	const firstName = post.name.split(" ")[0] ?? post.name;

	return (
		<Animated.View style={[styles.post, entrance]}>
			<View style={styles.header}>
				<Avatar name={post.name} size={36} ring />
				<View style={styles.author}>
					<Text style={styles.name} numberOfLines={1}>
						{post.name}
						{post.with ? <Text style={styles.with}>{HOME_COPY.feedWith + post.with}</Text> : null}
					</Text>
					<Text style={styles.meta}>{post.team ? `${post.team} · ${post.time}` : post.time}</Text>
				</View>
				{post.rank ? (
					<GlassSurface
						appearance={styles.rankAppearance}
						radius={theme.pace.radii.pill}
						style={styles.rank}
					>
						<Text style={styles.rankText}>#{post.rank}</Text>
						<Icon
							name={post.up ? "trending-up" : "trending-down"}
							size={13}
							color={post.up ? colors.trendUp : colors.trendDown}
						/>
					</GlassSurface>
				) : null}
			</View>
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
								team={post.team ? { name: post.team, rank: post.rank, isUp: post.up } : null}
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
				<View style={styles.action}>
					<Icon name="message-circle" size={ACTION_ICON} />
					<Text style={styles.count}>{post.comments}</Text>
				</View>
				<Icon name="send" size={20} />
			</View>
			<Text style={styles.caption}>
				<Text style={styles.captionName}>{firstName}</Text> {post.caption}
			</Text>
		</Animated.View>
	);
};
