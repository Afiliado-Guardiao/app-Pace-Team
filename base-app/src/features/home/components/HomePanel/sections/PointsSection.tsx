import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

import { useTheme } from "@/theme";
import { formatPoints } from "@/lib/pace";

import { PANEL } from "../constants";
import { PANEL_COPY } from "../copy";
import { IPanelData } from "../hooks/usePanelData";
import { useTickCount } from "../hooks/useTickCount";
import { useWaveClock } from "../hooks/useWaveClock";

import { GAUGE, GAUGE_RATIO, PointsGauge } from "./PointsGauge";
import { PointsWaves } from "./PointsWaves";
import { createSectionStyles } from "./styles";

interface IPointsSectionProps {
	points: IPanelData["points"];
	isActive: boolean;
	k: number;
}

const NUMBER_SIZE = 56;

// Pontos: medidor de tracinhos com a agulha no topo, o número grande, as
// ondas e duas linhas de texto (sem quadradinhos: os cards abaixo já mostram)
export const PointsSection: React.FC<IPointsSectionProps> = ({ points, isActive, k }) => {
	const { theme } = useTheme();
	const s = createSectionStyles(theme, k);
	const target = Math.round(points.fraction * GAUGE.ticks);
	const lit = useTickCount(target, isActive);
	// O número sobe junto com os tracinhos: cada tracinho aceso é a fração dos
	// pontos até ali (512 → 12, 23, 35… até 512 no último)
	const shown = target > 0 ? Math.round((points.value * lit) / target) : points.value;
	const seconds = useWaveClock(isActive);
	const w = PANEL.baseWidth * k;
	const h = PANEL.sectionHeight * k;
	const gaugeW = GAUGE.w * k;
	const at = (top: number, height?: number): ViewStyle => ({
		position: "absolute",
		left: 0,
		right: 0,
		top: h * top,
		height,
		alignItems: "center",
	});
	const number: TextStyle = {
		...s.number,
		fontSize: NUMBER_SIZE * k,
		lineHeight: NUMBER_SIZE * k * 1.15,
	};
	const unit: TextStyle = { ...s.strong, fontSize: 16 * k };

	return (
		<View style={{ width: w, height: h }}>
			<View style={at(0.02)}>
				<PointsGauge width={gaugeW} lit={lit} />
			</View>
			<View
				style={[
					at(0.27),
					{ flexDirection: "row", justifyContent: "center", alignItems: "baseline", gap: 4 },
				]}
			>
				<Text style={number}>{formatPoints(shown)}</Text>
				<Text style={unit}>{PANEL_COPY.points.unit}</Text>
			</View>
			<View style={at(0.53, 40)}>
				<PointsWaves width={w * 0.76} seconds={seconds} />
			</View>
			<View style={[at(0.71), { gap: 6 * k, paddingHorizontal: 20 * k }]}>
				<Text style={s.title}>{PANEL_COPY.points.lineA}</Text>
				<Text style={s.text}>{points.lineB}</Text>
			</View>
			<View style={{ height: gaugeW * GAUGE_RATIO }} />
		</View>
	);
};
