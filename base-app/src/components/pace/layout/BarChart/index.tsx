import React from "react";
import { Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { useEntrance } from "../../animations";
import { useLayoutSize } from "../../hooks";
import { GradientLayers } from "../../primitives";

import { createBarChartStyles } from "./styles";
import { IBarChartProps, IBarColumnProps } from "./types";

const STAGGER = 60;

// Uma barra que cresce da base (pt-grow) com atraso escalonado.
const BarColumn: React.FC<IBarColumnProps> = ({ datum, index, height, isHighlight, styles }) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const entrance = useEntrance("grow", { delay: index * STAGGER });
	const barStyle = isHighlight
		? styles.barHighlight
		: datum.value > 0
			? styles.bar
			: styles.barEmpty;

	return (
		<View style={styles.column}>
			<Animated.View style={[barStyle, { height }, entrance]} onLayout={onLayout}>
				{isHighlight && size ? (
					<View style={styles.barClip}>
						<GradientLayers
							layers={theme.pace.gradients.progressVertical}
							width={size.width}
							height={size.height}
						/>
					</View>
				) : null}
			</Animated.View>
			<Text style={styles.label}>{datum.label}</Text>
		</View>
	);
};

// Gráfico de barras semanal: a barra de destaque leva o gradiente laranja com brilho.
export const BarChart: React.FC<IBarChartProps> = ({
	data,
	max,
	areaHeight,
	minHeight = 0,
	highlightIndex,
	radius,
	idleColor,
}) => {
	const { theme } = useTheme();
	const styles = createBarChartStyles(theme, { areaHeight, radius, idleColor });
	const top = max ?? Math.max(...data.map((d) => d.value), 1);
	const highlight = highlightIndex ?? data.findIndex((d) => d.value === top);

	return (
		<View style={styles.chart}>
			{data.map((datum, index) => (
				<BarColumn
					key={index}
					datum={datum}
					index={index}
					height={Math.max(minHeight, (datum.value / top) * areaHeight)}
					isHighlight={index === highlight}
					styles={styles}
				/>
			))}
		</View>
	);
};

export * from "./types";
