import React from "react";
import { Text, View } from "react-native";

import { CountUp, GlassSurface, Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { STACK } from "../../constants";
import { IViradaFaceData } from "../../hooks/useHomeFaces";
import { FlameBadge } from "../FlameBadge";
import { ProgressLine } from "../ProgressLine";

import { createViradaFaceStyles } from "./styles";

const FLAME = 40;
const CHEVRON = 18;
const BAR_HEIGHT = 5;

// Face "Modo Virada" da pilha: estado da disputa, diferença de pontos e barra.
export const ViradaFace: React.FC<{ data: IViradaFaceData; isFresh: boolean }> = ({
	data,
	isFresh,
}) => {
	const { theme } = useTheme();
	const styles = createViradaFaceStyles(theme, data.tone, STACK.height);

	return (
		<GlassSurface appearance={styles.appearance} radius={theme.pace.radii.hero} style={styles.card}>
			<View style={styles.header}>
				<FlameBadge isDone={data.isDone} size={FLAME} />
				<View style={styles.texts}>
					<Text style={styles.title} numberOfLines={1}>
						{data.label}
					</Text>
					<Text style={styles.sub} numberOfLines={1}>
						{data.sub}
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
						{data.sign}
						<CountUp key={data.diff} value={data.diff} />
						<Text style={styles.diffUnit}> pts</Text>
					</Text>
					<Text style={styles.position}>{data.move}</Text>
				</View>
				<View style={styles.bar}>
					<ProgressLine progress={data.progress} isDone={data.isDone} height={BAR_HEIGHT} />
				</View>
			</View>
		</GlassSurface>
	);
};
