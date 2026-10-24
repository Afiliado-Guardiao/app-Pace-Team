import React from "react";
import { Text, View } from "react-native";

import {
	GlassCard,
	Icon,
	InfoNote,
	ScreenBackground,
	ScreenScroll,
	SectionHeader,
	SegmentedControl,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { ChallengeCard } from "./components/ChallengeCard";
import { CHALLENGE_TABS, CHALLENGES_COPY } from "./constants";
import { useChallenges } from "./hooks/useChallenges";

const BADGE = 46;

const createChallengesStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		list: { gap: spacing.stackGap },
		unlocked: { flexDirection: "row" as const, gap: 8 },
		unlockedCard: { flex: 1, alignItems: "center" as const },
		badge: {
			width: BADGE,
			height: BADGE,
			borderRadius: BADGE / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.glass2,
		},
		badgeLabel: {
			marginTop: 10,
			textAlign: "center" as const,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		health: {
			flexDirection: "row" as const,
			gap: 12,
			padding: 14,
			borderRadius: 20,
			backgroundColor: colors.healthNoteBg,
			borderWidth: 1,
			borderColor: colors.healthNoteBorder,
		},
		healthIcon: { marginTop: 1 },
		healthText: {
			flex: 1,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			lineHeight: typography.sizes.label * 1.45,
			color: colors.ink[200],
		},
		colors: {
			orange300: colors.orange[300],
			orange400: colors.orange[400],
			rankGold: colors.rankGold,
		},
	};
};

// 15 Desafios e conquistas: metas da semana, conquistas e cuidado com o corpo.
export const ChallengesScreen: React.FC = () => {
	const { theme } = useTheme();
	const challenges = useChallenges();
	const styles = createChallengesStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.runnerMountain} />
			<ScreenScroll>
				<TopBar title={CHALLENGES_COPY.title} onBack={challenges.goBack} />
				<SegmentedControl
					options={CHALLENGE_TABS}
					value={challenges.tab}
					onChange={challenges.setTab}
					testID="challenges-tab"
				/>
				<View style={styles.list}>
					{challenges.list.map((c) => (
						<ChallengeCard key={c.title} challenge={c} />
					))}
					{challenges.emptyNote ? <InfoNote icon="users">{challenges.emptyNote}</InfoNote> : null}
				</View>
				<SectionHeader title={CHALLENGES_COPY.unlocked} />
				{challenges.unlocked.length ? null : (
					<InfoNote icon="medal">{CHALLENGES_COPY.noMedals}</InfoNote>
				)}
				<View style={styles.unlocked}>
					{challenges.unlocked.map((u) => (
						<GlassCard key={u.label} padding={14} radius={22} style={styles.unlockedCard}>
							<View style={styles.badge}>
								<Icon name={u.icon} size={22} color={styles.colors[u.color]} />
							</View>
							<Text style={styles.badgeLabel}>{u.label}</Text>
						</GlassCard>
					))}
				</View>
				<View style={styles.health}>
					<Icon
						name="heart-pulse"
						size={18}
						color={theme.pace.colors.statusInfo}
						style={styles.healthIcon}
					/>
					<Text style={styles.healthText}>{CHALLENGES_COPY.health}</Text>
				</View>
			</ScreenScroll>
		</View>
	);
};
