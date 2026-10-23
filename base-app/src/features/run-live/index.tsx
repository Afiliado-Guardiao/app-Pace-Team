import React from "react";
import { Image, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	AvatarStack,
	Button,
	GlassSurface,
	GradientLayers,
	Highlight,
	Icon,
	IconButton,
	Sheet,
	TopBar,
	useLayoutSize,
} from "@/components/pace";
import { GpsDot } from "@/components/shared/GpsDot";
import { RunMap } from "@/components/shared/RunMap";
import { useTheme } from "@/theme";
import { formatDuration, formatKm, formatPace, formatSpeed, MEMBERS, ONLINE } from "@/lib/pace";

import { MetricPill } from "./components/MetricPill";
import { RUN_LIVE_COPY } from "./constants";
import { useRunLive } from "./hooks/useRunLive";
import { createRunLiveStyles, SCRIM_BOTTOM, SCRIM_TOP } from "./styles";

// 06b Corrida ao vivo: rota no mapa, tempo, distância, ritmo e controles.
export const RunLiveScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const { size, onLayout } = useLayoutSize();
	const live = useRunLive();
	const styles = createRunLiveStyles(theme, insets);
	const pace = formatPace(live.km > 0 ? live.seconds / live.km : 0);

	return (
		<View style={styles.root} onLayout={onLayout}>
			<RunMap route={live.route} friends={live.friends} showMe interactive={false} />
			{size ? (
				<>
					<View style={styles.topScrim} pointerEvents="none">
						<GradientLayers
							layers={theme.pace.gradients.scrimTop}
							width={size.width}
							height={SCRIM_TOP}
						/>
					</View>
					<View style={styles.bottomScrim} pointerEvents="none">
						<GradientLayers
							layers={theme.pace.gradients.scrimBottom}
							width={size.width}
							height={SCRIM_BOTTOM}
						/>
					</View>
				</>
			) : null}
			<View style={styles.top}>
				<TopBar
					title={
						<View style={styles.titlePill}>
							<GpsDot ok />
							<Text style={styles.titlePillText}>
								{live.isTeam ? RUN_LIVE_COPY.team : RUN_LIVE_COPY.solo}
							</Text>
						</View>
					}
					onBack={live.goBack}
					right={{ icon: "map", label: "Mapa", onPress: live.openMap }}
				/>
				<Text style={styles.title}>
					{live.isTeam ? (
						<>
							{RUN_LIVE_COPY.titleTeamStart}{" "}
							<Highlight>{RUN_LIVE_COPY.titleTeamHighlight}</Highlight>
						</>
					) : (
						RUN_LIVE_COPY.titleSolo
					)}
				</Text>
				<View style={styles.crew}>
					{live.isTeam ? (
						<View style={styles.photos}>
							{ONLINE.map((f, i) => (
								<Image
									key={f.name}
									source={f.image}
									style={[styles.photo, i > 0 ? styles.photoOverlap : null]}
								/>
							))}
						</View>
					) : (
						<AvatarStack people={MEMBERS.slice(1, 4)} size={30} extra={2} />
					)}
					<Text style={styles.crewText}>
						{live.isTeam ? RUN_LIVE_COPY.teamRunning : RUN_LIVE_COPY.crewRunning}
					</Text>
				</View>
			</View>
			<View style={styles.bottom}>
				<View style={styles.center}>
					<Text style={styles.time}>{formatDuration(live.seconds)}</Text>
					<Text style={styles.timeLabel}>
						{live.isPaused ? RUN_LIVE_COPY.paused : RUN_LIVE_COPY.total}
					</Text>
				</View>
				<View style={styles.distance}>
					<GlassSurface appearance={styles.pinAppearance} radius={22} style={styles.pin}>
						<Icon name="map-pin" size={18} />
					</GlassSurface>
					<Text style={styles.km}>{formatKm(live.km)}</Text>
					<Text style={styles.kmLabel}>km</Text>
				</View>
				{live.isPaused ? (
					<View style={styles.pausedActions}>
						<Button variant="light" size="sm" icon="square" onPress={live.openConfirm}>
							{RUN_LIVE_COPY.finish}
						</Button>
						<View style={styles.pausedColumn}>
							<Button variant="glass" size="sm" icon="share-2" onPress={live.openShare}>
								{RUN_LIVE_COPY.share}
							</Button>
							<Button size="sm" icon="camera" onPress={live.openPost}>
								{RUN_LIVE_COPY.post}
							</Button>
						</View>
					</View>
				) : null}
				<View style={styles.controls}>
					<MetricPill icon="gauge" label={RUN_LIVE_COPY.pace} value={pace} />
					{live.isPaused ? (
						<IconButton
							icon="play"
							variant="accent"
							size={62}
							label={RUN_LIVE_COPY.resume}
							onPress={live.resume}
							testID="run-resume"
						/>
					) : (
						<IconButton
							icon="pause"
							size={62}
							label={RUN_LIVE_COPY.pause}
							onPress={live.pause}
							testID="run-pause"
						/>
					)}
					<MetricPill
						icon="wind"
						label={RUN_LIVE_COPY.speed}
						value={formatSpeed(live.km, live.seconds)}
					/>
				</View>
			</View>
			<Sheet
				open={live.isConfirmOpen}
				title={RUN_LIVE_COPY.confirmTitle}
				onClose={live.closeConfirm}
				actions={
					<>
						<Button fullWidth size="lg" onPress={live.handleFinish} testID="run-finish">
							{RUN_LIVE_COPY.confirmSave}
						</Button>
						<Button fullWidth variant="ghost" onPress={live.resume}>
							{RUN_LIVE_COPY.confirmKeep}
						</Button>
					</>
				}
			>
				{`${formatKm(live.km)}${RUN_LIVE_COPY.confirmBody}${formatDuration(live.seconds)}${RUN_LIVE_COPY.confirmNote}`}
			</Sheet>
		</View>
	);
};
