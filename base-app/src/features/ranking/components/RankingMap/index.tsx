import React from "react";
import { Image, Text, View } from "react-native";

import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassSurface, IconButton } from "@/components/pace";
import { useTheme } from "@/theme";
import { IRankedTeam } from "@/lib/pace";

import { RANKING_COPY } from "../../constants";
import { RankingFilters } from "../RankingFilters";

import { MAP_ART } from "./assets";
import { Fade } from "./Fade";
import { REGIONS } from "./geometry";
import { useRankingMap } from "./hooks/useRankingMap";
import { MapCard } from "./MapCard";
import { MapCompetitor } from "./MapCompetitor";
import { createRankingMapStyles, MAP_COLORS } from "./mapStyles";

export interface IRankingMapProps {
	teams: readonly IRankedTeam[];
	dataKey: string;
	week: string;
	filters: React.ComponentProps<typeof RankingFilters>;
	onList: () => void;
	onRules: () => void;
	onOpenTeam: (team: IRankedTeam) => void;
}

const COPY = {
	list: "Ver em lista",
	rules: "Como pontuamos",
	top: "Ir ao cume",
	mine: "Minha equipe",
	more: "equipes",
} as const;

// Ranking imersivo: a trilha da floresta até o cume, cada equipe com a sua
// bandeira; abre no cume e desliza até a sua equipe
export const RankingMap: React.FC<IRankingMapProps> = (props) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const map = useRankingMap({ teams: props.teams, dataKey: props.dataKey });
	const styles = createRankingMapStyles(theme, { world: map.world, insetsTop: insets.top });
	const current = map.placed.at(map.selected);
	const ahead = current && current.rank > 1 ? (props.teams.at(current.rank - 2) ?? null) : null;

	return (
		<View style={styles.root}>
			<Animated.ScrollView
				ref={map.scroll.ref}
				style={styles.scroll}
				contentContainerStyle={styles.world}
				showsVerticalScrollIndicator={false}
				onScrollBeginDrag={map.scroll.stop}
				testID="ranking-map"
			>
				<Image source={MAP_ART.trail} style={styles.trail} resizeMode="cover" />
				<Fade from={MAP_COLORS.groundClear} to={MAP_COLORS.ground} style={styles.trailEnd} />
				{REGIONS.map(([label, py]) => (
					<View key={label} style={[styles.region, { top: map.world.toY(py) }]}>
						<View style={styles.regionDash} />
						<Text style={styles.regionText}>{label.toUpperCase()}</Text>
					</View>
				))}
				{map.placed.map((spot, i) => (
					<MapCompetitor
						key={spot.team.id ?? spot.team.name}
						spot={spot}
						myRank={map.myIndex + 1}
						isSelected={i === map.selected}
						replay={props.dataKey}
						onPress={() => {
							map.select(i);
						}}
					/>
				))}
				{map.more > 0 ? (
					<View style={[styles.more, { left: map.moreX - 70, top: map.moreY }]}>
						<Text style={styles.moreText}>{`+${String(map.more)} ${COPY.more}`}</Text>
					</View>
				) : null}
			</Animated.ScrollView>
			<Fade from={MAP_COLORS.headerShade} to={MAP_COLORS.headerClear} style={styles.topShade} />
			<Fade from={MAP_COLORS.bottomClear} to={MAP_COLORS.bottomShade} style={styles.bottomShade} />
			<View style={styles.header} pointerEvents="box-none">
				<View style={styles.titleRow}>
					<View style={styles.titleText}>
						<Text style={styles.title} accessibilityRole="header">
							{RANKING_COPY.title}
						</Text>
						<Text style={styles.sub}>{props.week}</Text>
					</View>
					<IconButton
						icon="list"
						label={COPY.list}
						onPress={props.onList}
						testID="ranking-to-list"
					/>
					<IconButton
						icon="info"
						label={COPY.rules}
						onPress={props.onRules}
						testID="ranking-rules"
					/>
				</View>
				<RankingFilters {...props.filters} />
			</View>
			<View style={styles.bottom} pointerEvents="box-none">
				<View style={styles.controls}>
					<IconButton
						icon="mountain-snow"
						label={COPY.top}
						onPress={map.goTop}
						testID="ranking-map-top"
					/>
					<IconButton
						icon="locate-fixed"
						label={COPY.mine}
						onPress={map.goMine}
						testID="ranking-map-mine"
					/>
				</View>
				{current ? (
					<MapCard
						team={current.team}
						rank={current.rank}
						ahead={ahead}
						onOpen={() => {
							props.onOpenTeam(current.team);
						}}
					/>
				) : (
					<GlassSurface appearance={styles.emptyAppearance} radius={24} style={styles.empty}>
						<Text style={styles.emptyTitle}>{RANKING_COPY.emptyTitle}</Text>
						<Text style={styles.emptyBody}>{RANKING_COPY.emptyBody}</Text>
					</GlassSurface>
				)}
			</View>
		</View>
	);
};
