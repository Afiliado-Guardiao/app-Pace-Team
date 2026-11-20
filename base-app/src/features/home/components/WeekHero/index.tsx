import React from "react";
import { Pressable, Text, View } from "react-native";

import { Canvas, Picture } from "@shopify/react-native-skia";
import Animated from "react-native-reanimated";

import { Icon } from "@/components/pace";
import { HintTip } from "@/components/shared";
import { useTheme } from "@/theme";
import { useHint } from "@/lib/hints";
import { PRIZE_ART } from "@/lib/prizes";

import { HOME_COPY } from "../../constants";
import { useTeamPresence } from "../../hooks/useTeamPresence";
import { useTrackBuddy } from "../../hooks/useTrackBuddy";
import { IWeekHero } from "../../hooks/useWeekHero";
import { IWeekSummary } from "../../hooks/useWeekSummary";
import { HeroPill } from "../HeroPill";
import { HomePanel } from "../HomePanel";
import { useHomePanel } from "../HomePanel/hooks/useHomePanel";
import { PopIn } from "../HomePanel/PopIn";
import { InnerTile } from "../InnerTile";
import { TeamPresence } from "../TeamPresence";
import { TrackBuddy } from "../TrackBuddy";

import { HOP_POINTS, HOP_TEAM, WEATHER_ICON_COLORS } from "./constants";
import { useSkyPicture } from "./hooks/useSkyPicture";
import { useWeekHeroScene } from "./hooks/useWeekHeroScene";
import { createWeekHeroStyles } from "./styles";

interface IWeekHeroProps {
	week: IWeekSummary;
	hero: IWeekHero;
	onOpenTeam: () => void;
	onOpenPoints: () => void;
}

const ICON_SIZE = 18;

// "Sua semana" do Início: o título da seção, o painel de acrílico (a cena do
// Bud, com medidor, pista e um corredor por colega online, é uma das seções),
// o clima lá fora e os dois cards.
export const WeekHero: React.FC<IWeekHeroProps> = ({ week, hero, onOpenTeam, onOpenPoints }) => {
	const { theme } = useTheme();
	const panel = useHomePanel();
	const presence = useTeamPresence();
	const view = useWeekHeroScene(hero, week);
	const sky = useSkyPicture({
		frame: hero.layout.frame,
		weather: hero.weather.weather,
		clocks: hero.clocks,
	});
	const trackBud = useTrackBuddy(hero.jump, view.k);
	const budHint = useHint("bud");
	const pointsHint = useHint("points");
	const teamHint = useHint("team-tile");
	const { layout, weather } = hero;
	const styles = createWeekHeroStyles(theme, {
		k: view.k,
		ks: view.ks,
		width: layout.width,
		frameWidth: layout.frame.width,
		frameHeight: layout.frame.height,
	});
	const weatherIcon = { name: weather.icon, color: WEATHER_ICON_COLORS[weather.weather.preset] };
	const isReady = layout.width > 0;

	return (
		<View style={styles.root} onLayout={layout.onHeroLayout} testID="week-hero">
			<View style={styles.titleRow}>
				<PopIn key={`i${String(panel.pager.index)}`} style={styles.iconDot}>
					<Icon name={panel.title.icon ?? "activity"} size={ICON_SIZE} />
				</PopIn>
				<PopIn key={`t${String(panel.pager.index)}`} style={styles.titleText}>
					<Text style={styles.title} numberOfLines={1}>
						{panel.title.title}
					</Text>
					<Text style={styles.subtitle} numberOfLines={1}>
						{panel.title.subtitle}
					</Text>
				</PopIn>
				<HeroPill
					text={weather.temp}
					icon={weatherIcon}
					accessibilityLabel={weather.label}
					onLongPress={weather.onLongPress}
					testID="week-hero-weather"
				/>
			</View>
			{weather.credit ? <Text style={styles.credit}>{weather.credit}</Text> : null}
			<HomePanel
				panel={panel}
				budColor={trackBud.look.color}
				buddy={
					<View style={styles.panelBox}>
						{isReady ? (
							<Canvas style={styles.weather} pointerEvents="none">
								<Picture picture={sky} />
							</Canvas>
						) : null}
						{isReady ? (
							<Canvas style={styles.scene} pointerEvents="none">
								<Picture picture={view.scene} />
							</Canvas>
						) : null}
						<TrackBuddy buddy={trackBud} box={styles.budBox} />
						{isReady ? (
							<Canvas style={styles.weather} pointerEvents="none">
								<Picture picture={view.front} />
							</Canvas>
						) : null}
						<View style={[styles.buddyHit, styles.hintAnchor]} pointerEvents="none">
							<HintTip id="bud" isShown={budHint.isShown} side="top" />
						</View>
						<View style={styles.presence}>
							<TeamPresence presence={presence} width={layout.width - 28 * view.k} />
						</View>
						<Pressable
							style={styles.buddyHit}
							onPress={() => {
								budHint.done();
								hero.onBuddyPress();
							}}
							accessibilityRole="button"
							accessibilityLabel="Pace Buddy"
							testID="week-hero-buddy"
						/>
					</View>
				}
			/>
			<View style={styles.tiles}>
				<Animated.View key={`hp-${String(view.replay)}`} style={[styles.tileHigh, HOP_POINTS]}>
					<InnerTile
						icon="zap"
						art={PRIZE_ART.coinPoints}
						lineA={HOME_COPY.pointsA}
						lineB={HOME_COPY.pointsB}
						value={week.points}
						unit="pts"
						onPress={() => {
							pointsHint.done();
							onOpenPoints();
						}}
					/>
					<HintTip id="points" isShown={pointsHint.isShown} side="top" />
				</Animated.View>
				<Animated.View key={`ht-${String(view.replay)}`} style={[styles.tileLow, HOP_TEAM]}>
					<InnerTile
						icon="users"
						art={PRIZE_ART.badgeTeam}
						lineA={week.teamFirst}
						lineB={week.teamRest}
						value={week.rank}
						unit={HOME_COPY.teamUnit}
						onPress={() => {
							teamHint.done();
							onOpenTeam();
						}}
					/>
					<HintTip id="team-tile" isShown={teamHint.isShown} side="top" />
				</Animated.View>
			</View>
		</View>
	);
};
