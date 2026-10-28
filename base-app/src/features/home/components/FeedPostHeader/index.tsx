import React from "react";
import { Pressable, Text, View } from "react-native";

import { Avatar, GlassSurface, Icon } from "@/components/pace";
import { useTheme } from "@/theme";
import { IFeedPost } from "@/lib/pace";

import { HOME_COPY, POST_MENU_COPY } from "../../constants";
import { createFeedPostStyles } from "../FeedPost/styles";

interface IFeedPostHeaderProps {
	post: IFeedPost;
	// Abre o perfil do autor (ou a equipe, nos posts da equipe)
	onOpen: () => void;
	onMore: () => void;
}

const ACTION_ICON = 21;

// Cabeçalho do post: foto e nome do autor (ou escudo e nome da equipe nos
// posts da equipe), posição da equipe no ranking e o menu "···".
export const FeedPostHeader: React.FC<IFeedPostHeaderProps> = ({ post, onOpen, onMore }) => {
	const { theme } = useTheme();
	const { colors } = theme.pace;
	const styles = createFeedPostStyles(theme, 1);
	const isTeam = Boolean(post.isTeamPost && post.team);
	const title = isTeam ? post.team : post.name;
	const photo = isTeam ? post.teamLogo : post.avatarUrl;
	const meta = isTeam
		? `${HOME_COPY.teamPostBy}${post.name} · ${post.time}`
		: [post.team, post.time].filter(Boolean).join(" · ");

	return (
		<View style={styles.header}>
			<Pressable
				onPress={onOpen}
				accessibilityRole="button"
				accessibilityLabel={title}
				testID={`feed-post-author-${post.id}`}
				style={styles.authorButton}
			>
				<Avatar name={title} src={photo ?? undefined} size={36} ring square={isTeam} />
				<View style={styles.author}>
					<Text style={styles.name} numberOfLines={1}>
						{title}
						{post.with ? <Text style={styles.with}>{HOME_COPY.feedWith + post.with}</Text> : null}
					</Text>
					<Text style={styles.meta} numberOfLines={1}>
						{meta}
					</Text>
				</View>
			</Pressable>
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
			<Pressable
				onPress={onMore}
				hitSlop={10}
				accessibilityRole="button"
				accessibilityLabel={POST_MENU_COPY.more}
				testID={`feed-post-more-${post.id}`}
			>
				<Icon name="more-horizontal" size={ACTION_ICON} color={colors.textSecondary} />
			</Pressable>
		</View>
	);
};
