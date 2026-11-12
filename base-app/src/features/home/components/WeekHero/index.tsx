import React from "react";
import { Pressable, Text, View } from "react-native";

import { Canvas, Picture } from "@shopify/react-native-skia";
import Animated from "react-native-reanimated";

import { CountUp, Icon } from "@/components/pace";
import { useTheme } from "@/theme";
import { PRIZE_ART } from "@/lib/prizes";

import { HOME_COPY } from "../../constants";
import { useTrackBuddy } from "../../hooks/useTrackBuddy";
import { IWeekHero } from "../../hooks/useWeekHero";
import { IWeekSummary } from "../../hooks/useWeekSummary";
import { HeroPill } from "../HeroPill";
import { InnerTile } from "../InnerTile";
import { TrackBuddy } from "../TrackBuddy";

import { HOP_POINTS, HOP_TEAM, WEATHER_ICON_COLORS } from "./constants";
import { useWeekHeroScene } from "./hooks/useWeekHeroScene";
import { createWeekHeroStyles } from "./styles";

interface IWeekHeroProps {
	week: IWeekSummary;
	hero: IWeekHero;
	onOpenTeam: () => void;
}

const ICON_SIZE = 18;
const COUNT_DELAY = 300;
// Junto com o arco: sobe enquanto ele varre e assenta no valor
const COUNT_MS = 1500;

// "Sua semana" do Início: medidor de tracinhos, o Bud sentado na
// pista com um corredor por colega online, clima lá fora e os dois cards.
export const WeekHero: React.FC<IWeekHeroProps> = ({ week, hero, onOpenTeam }) => {
	const { theme } = useTheme();
	const view = useWeekHeroScene(hero, week);
	const trackBud = useTrackBuddy(hero.jump, view.k);
	const { layout, weather, online } = hero;
	const styles = createWeekHeroStyles(theme, {
		k: view.k,
		ks: view.ks,
		width: layout.width,
		heroY: layout.heroY,
		frameWidth: layout.frame.width,
		frameHeight: layout.frame.height,
	});
	const weatherIcon = { name: weather.icon, color: WEATHER_ICON_COLORS[weather.weather.preset] };
	const dotColor = theme.pace.colors.statusSuccess;
	const isReady = layout.width > 0;

	return (
		<View style={styles.root} onLayout={layout.onHeroLayout} testID="week-hero">
			<View style={styles.titleRow}>
				<View style={styles.iconDot}>
					<Icon name="activity" size={ICON_SIZE} />
				</View>
				<View style={styles.titleText}>
					<Text style={styles.title} numberOfLines={1}>
						{HOME_COPY.weekTitle}
					</Text>
					<Text style={styles.subtitle} numberOfLines={1}>
						{HOME_COPY.weekSubtitle}
					</Text>
				</View>
				<HeroPill
					text={weather.temp}
					icon={weatherIcon}
					accessibilityLabel={weather.label}
					onLongPress={weather.onLongPress}
					testID="week-hero-weather"
				/>
			</View>
			{weather.credit ? <Text style={styles.credit}>{weather.credit}</Text> : null}
			<View style={styles.box}>
				{isReady ? (
					<Canvas style={styles.fill} pointerEvents="none">
						<Picture picture={view.arc} />
					</Canvas>
				) : null}
				<Animated.View style={[styles.numberBox, view.numberStyle]} pointerEvents="none">
					<Text style={styles.number}>
						<CountUp
							key={view.replay}
							value={week.display}
							duration={COUNT_MS}
							delay={COUNT_DELAY}
						/>
					</Text>
				</Animated.View>
				<Text style={styles.kmLabel}>{HOME_COPY.gaugeLabel}</Text>
				{isReady ? (
					<Canvas style={styles.scene} pointerEvents="none">
						<Picture picture={view.scene} />
					</Canvas>
				) : null}
				<TrackBuddy buddy={trackBud} box={styles.budBox} />
				<View style={styles.online}>
					<HeroPill
						text={online.onlineText}
						dotColor={dotColor}
						accessibilityLabel={online.onlineText}
						testID="week-hero-online"
					/>
				</View>
				<Pressable
					style={styles.buddyHit}
					onPress={hero.onBuddyPress}
					accessibilityRole="button"
					accessibilityLabel="Pace Buddy"
					testID="week-hero-buddy"
				/>
			</View>
			<View style={styles.tiles}>
				<Animated.View key={`hp-${String(view.replay)}`} style={[styles.tileHigh, HOP_POINTS]}>
					<InnerTile
						icon="zap"
						art={PRIZE_ART.coinPoints}
						lineA={HOME_COPY.pointsA}
						lineB={HOME_COPY.pointsB}
						value={week.points}
						unit="pts"
					/>
				</Animated.View>
				<Animated.View key={`ht-${String(view.replay)}`} style={[styles.tileLow, HOP_TEAM]}>
					<InnerTile
						icon="users"
						art={PRIZE_ART.badgeTeam}
						lineA={week.teamFirst}
						lineB={week.teamRest}
						value={week.rank}
						unit={HOME_COPY.teamUnit}
						onPress={onOpenTeam}
					/>
				</Animated.View>
			</View>
			{isReady ? (
				<View style={styles.front} pointerEvents="none">
					<Canvas style={styles.frontCanvas}>
						<Picture picture={view.front} />
					</Canvas>
				</View>
			) : null}
		</View>
	);
};
