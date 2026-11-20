import React from "react";
import { Pressable, Text, TextStyle, View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { GradientLayers, Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { ACRYLIC } from "../constants";
import { PANEL_COPY } from "../copy";
import { IPanelData } from "../hooks/usePanelData";
import { usePulseRings } from "../hooks/usePulseRings";

import { createSectionStyles } from "./styles";

interface IRunSectionProps {
	run: IPanelData["run"];
	isActive: boolean;
	k: number;
	onStart: () => void;
}

const PLAY = 116;

// Corrida: play laranja com dois anéis pulsando e a última corrida embaixo
export const RunSection: React.FC<IRunSectionProps> = ({ run, isActive, k, onStart }) => {
	const { theme } = useTheme();
	const s = createSectionStyles(theme, k);
	const [ringA, ringB] = usePulseRings(isActive);
	const size = PLAY * k;
	const round: ViewStyle = { width: size, height: size, borderRadius: size / 2 };
	const ring: ViewStyle = {
		...round,
		position: "absolute",
		borderWidth: 2,
		borderColor: theme.pace.colors.accent,
	};
	const play: ViewStyle = {
		...round,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: theme.pace.shadows.glowAccentOuter,
	};
	const stats = run
		? [
				{ label: PANEL_COPY.run.last, value: `${run.km} km` },
				{ label: PANEL_COPY.run.time, value: run.time },
				{ label: PANEL_COPY.run.pace, value: `${run.pace} /km` },
			]
		: [];
	const value: TextStyle = { ...s.number, fontSize: 14 * k, textShadowRadius: 0 };

	return (
		<View style={[s.root, { justifyContent: "space-evenly", alignItems: "center" }]}>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<Animated.View style={[ring, ringA]} pointerEvents="none" />
				<Animated.View style={[ring, ringB]} pointerEvents="none" />
				<Pressable
					style={play}
					onPress={onStart}
					accessibilityRole="button"
					accessibilityLabel={PANEL_COPY.run.play}
					testID="home-panel-run-play"
				>
					<GradientLayers layers={theme.pace.gradients.accent} width={size} height={size} />
					<View>
						<Icon name="play" size={44 * k} color="#fff" strokeWidth={2.4} />
					</View>
				</Pressable>
			</View>
			<Text style={s.title}>{PANEL_COPY.run.start}</Text>
			{run ? (
				<View style={[s.row, { alignSelf: "stretch" }]}>
					{stats.map((st) => (
						<View key={st.label} style={[s.glassBox, { alignItems: "center" }]}>
							<Text style={s.small}>{st.label}</Text>
							<Text style={value} numberOfLines={1} adjustsFontSizeToFit>
								{st.value}
							</Text>
						</View>
					))}
				</View>
			) : (
				<Text style={[s.text, { color: ACRYLIC.white75 }]}>{PANEL_COPY.run.none}</Text>
			)}
		</View>
	);
};
