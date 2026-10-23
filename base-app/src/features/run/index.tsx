import React from "react";
import { Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	Chip,
	FloatingToast,
	GlassPill,
	GradientLayers,
	Highlight,
	IconButton,
	useLayoutSize,
} from "@/components/pace";
import { GpsDot } from "@/components/shared/GpsDot";
import { RunMap } from "@/components/shared/RunMap";
import { useTheme } from "@/theme";
import { ONLINE } from "@/lib/pace";
import { ROUTE_CENTER } from "@/lib/run";

import { GoalEditor } from "./components/GoalEditor";
import { OnlineCard } from "./components/OnlineCard";
import { StartButton } from "./components/StartButton";
import { RUN_COPY, RUN_MODES } from "./constants";
import { useRunSetup } from "./hooks/useRunSetup";
import { createRunSetupStyles } from "./styles";

const FRIEND_OFFSETS: readonly [number, number][] = [
	[0.0006, -0.0016],
	[-0.0009, 0.0002],
	[0.0005, 0.0015],
];

// 06a Preparar corrida: mapa com a sua posição, modo, meta e INICIAR.
export const RunSetupScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const { size, onLayout } = useLayoutSize();
	const setup = useRunSetup();
	const styles = createRunSetupStyles(theme, insets);
	const isTeam = setup.mode === "team";
	const me = setup.position ?? ROUTE_CENTER;
	const friends = isTeam
		? ONLINE.map((f, i) => ({
				image: f.image,
				label: "online",
				position: [
					me[0] + (FRIEND_OFFSETS[i]?.[0] ?? 0),
					me[1] + (FRIEND_OFFSETS[i]?.[1] ?? 0),
				] as const,
			}))
		: [];
	const gpsText =
		setup.gps === "ready"
			? `${RUN_COPY.gpsReady}${String(setup.accuracy)} m`
			: setup.gps === "denied"
				? RUN_COPY.gpsDenied
				: RUN_COPY.gpsSearching;

	return (
		<View style={styles.root} onLayout={onLayout}>
			<View style={styles.map}>
				<RunMap route={[]} me={me} showRoute={false} showMe interactive={false} friends={friends} />
			</View>
			{size ? (
				<>
					<View style={styles.topScrim} pointerEvents="none">
						<GradientLayers
							layers={theme.pace.gradients.scrimTop}
							width={size.width}
							height={140}
						/>
					</View>
					<View style={styles.fade} pointerEvents="none">
						<GradientLayers
							layers={theme.pace.gradients.scrimBottom}
							width={size.width}
							height={160}
						/>
					</View>
				</>
			) : null}
			<View style={styles.topBar}>
				<GlassPill>
					<GpsDot ok={setup.gps === "ready"} />
					{gpsText}
				</GlassPill>
				<IconButton icon="map" label={RUN_COPY.map} onPress={setup.openMap} />
			</View>
			<View style={styles.bottom}>
				<View>
					<Text style={styles.title}>
						{RUN_COPY.titleStart} <Highlight>{RUN_COPY.titleHighlight}</Highlight>
					</Text>
					<Text style={styles.subtitle}>
						{isTeam ? RUN_COPY.subtitleTeam : RUN_COPY.subtitleSolo}
					</Text>
				</View>
				<View style={styles.modes}>
					{RUN_MODES.map((item) => (
						<Chip
							key={item.mode}
							size="sm"
							icon={item.icon}
							selected={setup.mode === item.mode}
							onPress={() => {
								setup.setMode(item.mode);
							}}
							style={styles.mode}
						>
							{item.label}
						</Chip>
					))}
				</View>
				{isTeam ? <OnlineCard /> : null}
				<GoalEditor goal={setup.goal} onChange={setup.setGoal} />
				<View style={styles.startRow}>
					<StartButton enabled={setup.gps !== "searching"} onPress={setup.handleStart} />
				</View>
			</View>
			<FloatingToast toast={setup.toast} />
		</View>
	);
};
