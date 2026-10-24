import React from "react";
import { Pressable, Text, View } from "react-native";

import { Avatar, IconButton, ScreenBackground, ScreenScroll } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { FeedSection } from "./components/FeedSection";
import { HomeStack } from "./components/HomeStack";
import { WeekCard } from "./components/WeekCard";
import { HOME_COPY } from "./constants";
import { useHomeFeed } from "./hooks/useHomeFeed";
import { useHomeScreen } from "./hooks/useHomeScreen";
import { useWeekSummary } from "./hooks/useWeekSummary";

const AVATAR = 48;

const createHomeStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	return {
		root: { flex: 1 },
		header: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		who: { flex: 1 },
		name: {
			fontFamily: fonts.bold,
			fontSize: sizes.lg,
			lineHeight: sizes.lg * lineHeights.snug,
			color: colors.textPrimary,
		},
		greeting: { fontFamily: fonts.medium, fontSize: sizes.sm, color: colors.textSecondary },
	};
};

// 05 Início: semana do atleta, pilha (corrida da equipe / Modo Virada) e feed.
export const HomeScreen: React.FC = () => {
	const { theme } = useTheme();
	const home = useHomeScreen();
	const feed = useHomeFeed();
	const week = useWeekSummary();
	const styles = createHomeStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.runnerCitySunset} />
			<ScreenScroll hasRail scrollRef={feed.scrollRef} testID="home-scroll">
				<View style={styles.header}>
					<Pressable
						onPress={home.openProfile}
						accessibilityRole="button"
						accessibilityLabel="Perfil"
					>
						<Avatar name={home.userName} src={home.avatarUrl} size={AVATAR} />
					</Pressable>
					<View style={styles.who}>
						<Text style={styles.name}>{home.userName}</Text>
						<Text style={styles.greeting}>{HOME_COPY.greeting}</Text>
					</View>
					<IconButton
						icon="bell"
						badge={home.hasNotifications}
						label={HOME_COPY.notifications}
						size={AVATAR}
						onPress={home.openNotifications}
						testID="home-notifications"
					/>
				</View>
				<WeekCard week={week} onOpenTeam={home.openTeam} />
				<HomeStack onOpen={home.openStackCard} />
				<FeedSection posts={feed.posts} onLayout={feed.onFeedLayout} />
			</ScreenScroll>
		</View>
	);
};
