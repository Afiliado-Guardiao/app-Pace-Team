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
const EMPTY_TOP = 500;

// Pontos: medidor de tracinhos com a agulha no topo, o número grande, as
// ondas e duas linhas de texto (sem quadradinhos: os cards abaixo já mostram)
export const PointsSection: React.FC<IPointsSectionProps> = ({ points, isActive, k }) => {
	const { theme } = useTheme();
	const s = createSectionStyles(theme, k);
	const target = Math.round(points.fraction * GAUGE.ticks);
	const lit = useTickCount(target, isActive, GAUGE.ticks);
	// O número anda junto com os tracinhos: cada tracinho vale a mesma fração
	// dos pontos, então ele sobe além do valor no topo e volta até o valor certo
	// Semana sem pontos: só animação, o número sobe até uns 500 no topo e volta a 0
	const perTick = target > 0 ? points.value / target : EMPTY_TOP / GAUGE.ticks;
	// Sem tracinho aceso no fim, vale o número de verdade (pontos sem km também)
	const shown = target === 0 && lit === 0 ? points.value : Math.round(perTick * lit);
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
