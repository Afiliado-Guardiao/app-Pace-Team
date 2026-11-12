import React from "react";
import { Pressable, Text, View } from "react-native";

import { BuddyRunner } from "@/components/buddy";
import {
	Avatar,
	FloatingToast,
	IconButton,
	ScreenBackground,
	ScreenScroll,
	Toast,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { FeedSection } from "./components/FeedSection";
import { HeroSky } from "./components/HeroSky";
import { HomeStack } from "./components/HomeStack";
import { PostMenuSheet } from "./components/PostMenuSheet";
import { TeamHandoffSheet } from "./components/TeamHandoffSheet";
import { WeekHero } from "./components/WeekHero";
import { HOME_COPY } from "./constants";
import { useHomeFeed } from "./hooks/useHomeFeed";
import { useHomeScreen } from "./hooks/useHomeScreen";
import { useNotificationsOff } from "./hooks/useNotificationsOff";
import { usePostMenu } from "./hooks/usePostMenu";
import { useTeamHandoff } from "./hooks/useTeamHandoff";
import { useWeekHero } from "./hooks/useWeekHero";
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
	const menu = usePostMenu();
	const alerts = useNotificationsOff();
	const handoff = useTeamHandoff();
	const hero = useWeekHero({ myName: home.userName, hasToast: alerts.isOff });
	const styles = createHomeStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.runnerCitySunset} />
			<ScreenScroll
				hasRail
				scrollRef={feed.scrollRef}
				testID="home-scroll"
				backdrop={
					<>
						<HeroSky hero={hero} />
						<BuddyRunner feetY={hero.runnerFeetY} />
					</>
				}
			>
				<View style={styles.header} onLayout={hero.layout.onHeaderLayout}>
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
				{alerts.isOff ? (
					<View onLayout={hero.layout.onToastLayout}>
						<Toast
							tone="warning"
							icon="bell-off"
							title={HOME_COPY.notificationsOffTitle}
							message={HOME_COPY.notificationsOffBody}
							action={{ label: HOME_COPY.notificationsOffAction, onPress: alerts.openSettings }}
							testID="home-notifications-off"
						/>
					</View>
				) : null}
				<WeekHero week={week} hero={hero} onOpenTeam={home.openTeam} />
				<HomeStack onOpen={home.openStackCard} />
				<FeedSection posts={feed.posts} onMore={menu.open} onLayout={feed.onFeedLayout} />
			</ScreenScroll>
			<PostMenuSheet menu={menu} />
			<TeamHandoffSheet handoff={handoff} />
			<FloatingToast toast={menu.toast} />
			<FloatingToast toast={handoff.toast} />
		</View>
	);
};
