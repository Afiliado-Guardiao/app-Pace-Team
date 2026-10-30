import React from "react";
import { Text, View } from "react-native";

import { BuddyRunner } from "@/components/buddy";
import {
	Button,
	Chip,
	GlassCard,
	Icon,
	IconButton,
	Podium,
	RankRow,
	ScreenBackground,
	ScreenScroll,
	SegmentedControl,
	Sheet,
	tracking,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatPoints, PHOTOS } from "@/lib/pace";

import { RulesList } from "./components/RulesList";
import { RANKING_COPY, RANKING_SCOPES } from "./constants";
import { useRankingScreen } from "./hooks/useRankingScreen";

const TITLE = 30;
// Chão do Buddy corredor: no alto do primeiro card, por trás dele
const RUNNER_FEET_Y = 214;

const createRankingStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		root: { flex: 1 },
		header: {
			flexDirection: "row" as const,
			alignItems: "flex-end" as const,
			justifyContent: "space-between" as const,
		},
		title: {
			fontFamily: fonts.extrabold,
			fontSize: TITLE,
			lineHeight: TITLE * 1.1,
			letterSpacing: tracking(typography.tracking.tight, TITLE),
			color: colors.textPrimary,
		},
		sub: {
			marginTop: 6,
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			color: colors.textSecondary,
		},
		filters: {
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			rowGap: spacing[2],
			gap: spacing[2],
			alignItems: "center" as const,
		},
		city: {
			marginLeft: "auto" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 6,
		},
		cityText: { fontFamily: fonts.semibold, fontSize: sizes.label, color: colors.textSecondary },
		world: { alignItems: "center" as const, padding: 28 },
		worldTitle: {
			marginTop: spacing[3],
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			color: colors.textPrimary,
		},
		worldBody: {
			marginTop: 6,
			textAlign: "center" as const,
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			lineHeight: sizes.sm * typography.lineHeights.body,
			color: colors.textSecondary,
		},
		podium: { marginTop: spacing[2] },
		rows: { gap: spacing[2] },
	};
};

// 08 Ranking: pódio e lista das equipes por escopo e categoria.
export const RankingScreen: React.FC = () => {
	const { theme } = useTheme();
	const ranking = useRankingScreen();
	const styles = createRankingStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll
				hasRail
				testID="ranking-scroll"
				backdrop={<BuddyRunner feetY={RUNNER_FEET_Y} />}
			>
				<View style={styles.header}>
					<View>
						<Text style={styles.title} accessibilityRole="header">
							{RANKING_COPY.title}
						</Text>
						<Text style={styles.sub}>{ranking.week}</Text>
					</View>
					<IconButton
						icon="info"
						label={RANKING_COPY.rules}
						onPress={ranking.openRules}
						testID="ranking-rules"
					/>
				</View>
				<SegmentedControl
					size="sm"
					options={RANKING_SCOPES}
					value={ranking.scope}
					onChange={ranking.setScope}
					testID="ranking-scope"
				/>
				<View style={styles.filters}>
					{ranking.categories.map((v) => (
						<Chip
							key={v}
							size="sm"
							selected={ranking.category === v}
							onPress={() => {
								ranking.setCategory(v);
							}}
							testID={`ranking-category-${v}`}
						>
							{`${v} x ${v}`}
						</Chip>
					))}
					<View style={styles.city}>
						<Icon name="map-pin" size={14} color={theme.pace.colors.textSecondary} />
						<Text style={styles.cityText}>{ranking.city}</Text>
					</View>
				</View>
				{ranking.isWorld ? (
					<GlassCard style={styles.world}>
						<Icon name="globe" size={30} color={theme.pace.colors.orange[400]} />
						<Text style={styles.worldTitle}>{RANKING_COPY.worldTitle}</Text>
						<Text style={styles.worldBody}>{RANKING_COPY.worldBody}</Text>
					</GlassCard>
				) : null}
				{!ranking.isWorld && ranking.isEmpty ? (
					<GlassCard style={styles.world}>
						<Icon name="users" size={30} color={theme.pace.colors.orange[400]} />
						<Text style={styles.worldTitle}>{RANKING_COPY.emptyTitle}</Text>
						<Text style={styles.worldBody}>{RANKING_COPY.emptyBody}</Text>
					</GlassCard>
				) : null}
				{!ranking.isWorld && ranking.podium.length ? (
					<Podium
						teams={ranking.podium}
						onSelect={(t) => {
							ranking.openPodium(t.name);
						}}
						style={styles.podium}
					/>
				) : null}
				{ranking.isWorld ? null : (
					<View style={styles.rows}>
						{ranking.rows.map((t, i) => (
							<RankRow
								key={t.id ?? t.name}
								position={i + ranking.firstRowPosition}
								name={t.name}
								city={t.city}
								km={t.km}
								points={formatPoints(t.points)}
								delta={t.delta}
								logo={t.logoUrl ?? undefined}
								isYou={t.you}
								onPress={() => {
									ranking.openTeam(t);
								}}
							/>
						))}
					</View>
				)}
			</ScreenScroll>
			<Sheet
				open={ranking.isRulesOpen}
				title={RANKING_COPY.rulesTitle}
				onClose={ranking.closeRules}
				actions={
					<Button fullWidth onPress={ranking.closeRules}>
						{RANKING_COPY.rulesOk}
					</Button>
				}
			>
				<RulesList />
			</Sheet>
		</View>
	);
};
