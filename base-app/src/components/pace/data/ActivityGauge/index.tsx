import React from "react";
import { Text, View } from "react-native";

import Svg, {
	Defs,
	FeDropShadow,
	Filter,
	Line,
	LinearGradient,
	Path,
	Stop,
} from "react-native-svg";

import { useTheme } from "@/theme";

import { CountUp } from "../../core/CountUp";
import { useSvgId } from "../../hooks";
import { splitStopColor } from "../../utils";

import {
	DEFAULT_SIZE,
	DEFAULT_STROKE,
	GLOW_DEVIATION,
	GLOW_OPACITY,
	TICK_WIDTH,
} from "./constants";
import { useActivityGauge } from "./hooks/useActivityGauge";
import { createActivityGaugeStyles } from "./styles";
import { IActivityGaugeProps } from "./types";

const DEFAULT_MAX = 100;
const COUNT_DURATION = 1300;
const COUNT_DELAY = 120;

// Medidor em arco (pontuação): gradiente laranja com brilho, marcas no trecho vazio
// e número central contando com overshoot.
export const ActivityGauge: React.FC<IActivityGaugeProps> = ({
	value,
	max = DEFAULT_MAX,
	size = DEFAULT_SIZE,
	label,
	display,
	unit,
	stroke = DEFAULT_STROKE,
	style,
}) => {
	const { theme } = useTheme();
	const id = useSvgId("pt-gauge");
	const { arcPath, ticks } = useActivityGauge(value / max, { size, stroke });
	const styles = createActivityGaugeStyles(theme, size);
	const [progressLayer] = theme.pace.gradients.progress;

	return (
		<View style={[styles.root, style]} accessibilityRole="progressbar" accessibilityLabel={label}>
			<Svg width={size} height={size} style={styles.svg}>
				<Defs>
					<LinearGradient id={`${id}-grad`} x1="0" y1="1" x2="1" y2="0">
						{progressLayer.stops.map((stop, index) => (
							<Stop key={index} offset={stop.offset} {...splitStopColor(stop.color)} />
						))}
					</LinearGradient>
					<Filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
						<FeDropShadow
							dx={0}
							dy={0}
							stdDeviation={GLOW_DEVIATION}
							floodColor={styles.glowColor}
							floodOpacity={GLOW_OPACITY}
						/>
					</Filter>
				</Defs>
				{ticks.map((tick, index) => (
					<Line
						key={index}
						{...tick}
						stroke={styles.tickColor}
						strokeWidth={TICK_WIDTH}
						strokeLinecap="round"
					/>
				))}
				{arcPath ? (
					<Path
						d={arcPath}
						fill="none"
						stroke={`url(#${id}-grad)`}
						strokeWidth={stroke}
						strokeLinecap="round"
						filter={`url(#${id}-glow)`}
					/>
				) : null}
			</Svg>
			<View style={styles.center}>
				<Text style={styles.value}>
					<CountUp value={display ?? value} duration={COUNT_DURATION} delay={COUNT_DELAY} />
					{unit ? <Text style={styles.unit}> {unit}</Text> : null}
				</Text>
				{label ? <Text style={styles.label}>{label}</Text> : null}
			</View>
		</View>
	);
};

export * from "./types";
