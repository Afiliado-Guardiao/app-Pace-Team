import React from "react";
import { LayoutChangeEvent, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";
import { IFeedPost } from "@/lib/pace";
import { IS_PREVIEW } from "@/constants/preview";

import { HOME_COPY } from "../../constants";
import { FeedPost } from "../FeedPost";

const TITLE_SIZE = 20;
const SECTION_TOP = 30;
const GAP = 22;

const createFeedSectionStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		section: { gap: GAP, marginTop: SECTION_TOP },
		header: {
			flexDirection: "row" as const,
			alignItems: "baseline" as const,
			justifyContent: "space-between" as const,
			paddingHorizontal: spacing[1],
		},
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: TITLE_SIZE,
			color: colors.textPrimary,
		},
		tag: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		empty: {
			paddingHorizontal: spacing[1],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
	};
};

// Feed social do Início: fotos de corridas que as equipes compartilharam.
interface IFeedSectionProps {
	posts: readonly IFeedPost[];
	onMore: (post: IFeedPost) => void;
	onLayout?: (event: LayoutChangeEvent) => void;
}

export const FeedSection: React.FC<IFeedSectionProps> = ({ posts, onMore, onLayout }) => {
	const { theme } = useTheme();
	const styles = createFeedSectionStyles(theme);
	// "Exemplos fictícios" só na prévia por link, que usa os posts do design
	const tag = IS_PREVIEW ? HOME_COPY.feedTag : null;
	const isEmpty = posts.length === 0;

	return (
		<View style={styles.section} onLayout={onLayout}>
			<View style={styles.header}>
				<Text style={styles.title} accessibilityRole="header">
					{HOME_COPY.feedTitle}
				</Text>
				{tag ? <Text style={styles.tag}>{tag}</Text> : null}
			</View>
			{isEmpty ? <Text style={styles.empty}>{HOME_COPY.feedEmpty}</Text> : null}
			{posts.map((post, index) => (
				<FeedPost key={post.id} post={post} index={index} onMore={onMore} />
			))}
		</View>
	);
};
