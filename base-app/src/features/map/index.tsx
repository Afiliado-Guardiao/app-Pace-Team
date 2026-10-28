import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PaceTabRail } from "@/components/core/PaceTabRail";
import {
	Chip,
	GlassSurface,
	GradientLayers,
	Icon,
	SegmentedControl,
	TopBar,
	useLayoutSize,
} from "@/components/pace";
import { RunMap } from "@/components/shared/RunMap";
import { useTheme } from "@/theme";

import { RouteCard } from "./components/RouteCard";
import { MAP_COPY, MAP_REGIONS, MAP_SCOPES } from "./constants";
import { useMapScreen } from "./hooks/useMapScreen";
import { createMapStyles, SCRIM_HEIGHT } from "./styles";

// 07 Mapa: minhas rotas salvas ou equipes por região (dados agregados).
export const MapScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const { size, onLayout } = useLayoutSize();
	const map = useMapScreen();
	const styles = createMapStyles(theme, insets);

	return (
		<View style={styles.root} onLayout={onLayout}>
			<RunMap
				route={map.route}
				progress={1}
				showRoute={!map.isTeams}
				showMe={map.isTeams}
				regions={map.isTeams ? MAP_REGIONS : undefined}
			/>
			{size ? (
				<View style={styles.scrim} pointerEvents="none">
					<GradientLayers
						layers={theme.pace.gradients.scrimTop}
						width={size.width}
						height={SCRIM_HEIGHT}
					/>
				</View>
			) : null}
			<View style={styles.top}>
				<TopBar
					title={MAP_COPY.title}
					onBack={map.goBack}
					right={{ icon: "locate-fixed", label: MAP_COPY.locate }}
				/>
				<SegmentedControl
					size="sm"
					options={MAP_SCOPES}
					value={map.scope}
					onChange={map.setScope}
					testID="map-scope"
				/>
				<View style={styles.chips}>
					<Chip
						size="sm"
						icon="route"
						selected={!map.isTeams}
						onPress={map.showMine}
						testID="map-layer-mine"
					>
						{MAP_COPY.mine}
					</Chip>
					<Chip
						size="sm"
						icon="users"
						selected={map.isTeams}
						onPress={map.showTeams}
						testID="map-layer-teams"
					>
						{MAP_COPY.teams}
					</Chip>
				</View>
			</View>
			<View style={styles.bottom}>
				{map.isTeams ? (
					<GlassSurface appearance={styles.noteAppearance} radius={16} style={styles.note}>
						<Icon name="shield" size={15} color={theme.pace.colors.orange[400]} />
						<Text style={styles.noteText}>{MAP_COPY.privacy}</Text>
					</GlassSurface>
				) : null}
				{!map.isTeams && map.isEmpty ? (
					<GlassSurface appearance={styles.noteAppearance} radius={16} style={styles.note}>
						<Icon name="route" size={15} color={theme.pace.colors.orange[400]} />
						<Text style={styles.noteText}>{MAP_COPY.empty}</Text>
					</GlassSurface>
				) : null}
				<ScrollView
					ref={map.railRef}
					horizontal
					showsHorizontalScrollIndicator={false}
					snapToInterval={map.cardStep}
					decelerationRate="fast"
					contentContainerStyle={styles.railContent}
					onMomentumScrollEnd={map.onRailSettle}
				>
					{map.runs.map((run, i) => (
						<RouteCard
							key={run.id}
							title={run.title}
							meta={`${run.km} ${run.unit ?? "km"} · ${run.time}`}
							seed={i}
							route={run.route}
							isSelected={i === map.selected}
							onPress={() => {
								map.openCard(i);
							}}
						/>
					))}
				</ScrollView>
				<View style={styles.dots}>
					{map.runs.map((run, i) => (
						<Pressable
							key={run.id}
							accessibilityRole="button"
							accessibilityLabel={run.title}
							testID={`map-dot-${String(i)}`}
							onPress={() => {
								map.pick(i);
							}}
							style={[styles.dot, i === map.selected ? styles.dotOn : null]}
						/>
					))}
				</View>
			</View>
			<PaceTabRail active="run" onChange={map.onRailChange} />
		</View>
	);
};
