import React from "react";
import { Text, View } from "react-native";

import { CountUp, GlassSurface, Icon } from "@/components/pace";
import { useTheme } from "@/theme";
import { RIVAL, VIRADA } from "@/lib/pace";
import { useStore } from "@/store";

import { HOME_COPY, STACK } from "../../constants";
import { FlameBadge } from "../FlameBadge";
import { ProgressLine } from "../ProgressLine";

import { createViradaFaceStyles } from "./styles";

const FLAME = 40;
const CHEVRON = 18;
const BAR_HEIGHT = 5;

// Face "Modo Virada" da pilha: estado da disputa, diferença de pontos e barra.
export const ViradaFace: React.FC<{ isFresh: boolean }> = ({ isFresh }) => {
	const { theme } = useTheme();
	const state = useStore((s) => s.viradaState);
	const scenario = VIRADA[state];
	const isDone = state === "done";
	const diff = scenario.us - scenario.rival;
	const styles = createViradaFaceStyles(theme, scenario.tone, STACK.height);

	return (
		<GlassSurface appearance={styles.appearance} radius={theme.pace.radii.hero} style={styles.card}>
			<View style={styles.header}>
				<FlameBadge isDone={isDone} size={FLAME} />
				<View style={styles.texts}>
					<Text style={styles.title} numberOfLines={1}>
						{scenario.label}
					</Text>
					<Text style={styles.sub}>
						{HOME_COPY.viradaSub}
						{RIVAL.name}
					</Text>
				</View>
				{isFresh ? (
					<View style={styles.freshDot} />
				) : (
					<Icon name="chevron-right" size={CHEVRON} color={theme.pace.colors.textTertiary} />
				)}
			</View>
			<View>
				<View style={styles.bottomRow}>
					<Text style={styles.diff}>
						{diff > 0 ? "+" : "−"}
						<CountUp key={diff} value={String(Math.abs(diff))} />
						<Text style={styles.diffUnit}> pts</Text>
					</Text>
					<Text style={styles.position}>{isDone ? HOME_COPY.viradaDone : HOME_COPY.viradaUp}</Text>
				</View>
				<View style={styles.bar}>
					<ProgressLine progress={scenario.progress} isDone={isDone} height={BAR_HEIGHT} />
				</View>
			</View>
		</GlassSurface>
	);
};
