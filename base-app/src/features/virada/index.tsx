import React from "react";
import { Text, View } from "react-native";

import { PaceTabRail } from "@/components/core/PaceTabRail";
import {
	Button,
	DemoTag,
	FloatingToast,
	Icon,
	RankRow,
	ScreenBackground,
	ScreenScroll,
	SectionHeader,
	SegmentedControl,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatPoints, PHOTOS, VIRADA_OPTIONS } from "@/lib/pace";

import { Contribution } from "./components/Contribution";
import { HeadToHead } from "./components/HeadToHead";
import { ViradaEmpty } from "./components/ViradaEmpty";
import { ViradaHero } from "./components/ViradaHero";
import { WeekDuel } from "./components/WeekDuel";
import { VIRADA_COPY } from "./constants";
import { useViradaScreen } from "./hooks/useViradaScreen";

const createViradaStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		titleRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[1.5] },
		titleText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		simulate: { gap: spacing[2] },
		simulateLabel: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[1.5],
			paddingLeft: spacing[1],
		},
		simulateText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
	};
};

// 05b Modo Virada: disputa direta com o time logo à frente no ranking.
export const ViradaScreen: React.FC = () => {
	const { theme } = useTheme();
	const virada = useViradaScreen();
	const styles = createViradaStyles(theme);
	const { colors } = theme.pace;
	const duel = virada.virada;
	const showEmpty = !duel && !virada.isLoading;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamTrack} />
			<ScreenScroll hasRail>
				<TopBar
					title={
						<View style={styles.titleRow}>
							<Icon name="flame" size={14} color={colors.orange[400]} />
							<Text style={styles.titleText}>{VIRADA_COPY.title}</Text>
						</View>
					}
					onBack={virada.goBack}
					right={{
						icon: "bell",
						label: "Notificações",
						badge: virada.hasNotifications,
						onPress: virada.goNotifications,
					}}
				/>
				{virada.isPreview ? (
					<View style={styles.simulate}>
						<View style={styles.simulateLabel}>
							<Icon name="flask-conical" size={12} color={colors.textTertiary} />
							<Text style={styles.simulateText}>{VIRADA_COPY.simulate}</Text>
						</View>
						<SegmentedControl
							size="sm"
							options={VIRADA_OPTIONS}
							value={duel?.state ?? "equal"}
							onChange={virada.changeState}
						/>
					</View>
				) : null}
				{duel ? (
					<>
						<ViradaHero virada={duel} title={virada.title} closesIn={virada.closesIn} />
						<Button size="lg" fullWidth icon="footprints" onPress={virada.goRun}>
							{virada.isDone ? VIRADA_COPY.keepLead : VIRADA_COPY.helpTeam}
						</Button>
						<SectionHeader
							title={VIRADA_COPY.cityRanking}
							action={VIRADA_COPY.seeAll}
							onAction={virada.goRanking}
						/>
						{duel.rows.map((team) => (
							<RankRow
								key={`${team.name}-${duel.state}`}
								position={team.position}
								name={team.name}
								city={team.city}
								km={team.km}
								points={formatPoints(team.points)}
								delta={team.delta}
								isYou={team.you}
							/>
						))}
						<SectionHeader title={VIRADA_COPY.weekly} />
						<WeekDuel virada={duel} />
						<SectionHeader title={VIRADA_COPY.headToHead} />
						<HeadToHead weeks={duel.headToHead} />
						<SectionHeader title={VIRADA_COPY.contribution} />
						<Contribution members={duel.members} total={duel.scenario.us} />
					</>
				) : null}
				{showEmpty ? (
					<ViradaEmpty
						hasTeam={virada.hasTeam}
						onTeam={virada.goTeam}
						onRanking={virada.goRanking}
					/>
				) : null}
				{virada.isPreview ? <DemoTag /> : null}
			</ScreenScroll>
			<PaceTabRail active="home" onChange={virada.onRailChange} />
			<FloatingToast toast={virada.toast} />
		</View>
	);
};
