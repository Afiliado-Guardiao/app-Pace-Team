import React from "react";
import { Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { useProgressFill } from "./hooks/useProgressFill";
import { ProgressGradient } from "./ProgressGradient";
import { createProgressBarStyles } from "./styles";
import { IProgressBarProps } from "./types";

const DEFAULT_MAX = 100;
const DEFAULT_HEIGHT = 8;

// Barra de progresso: laranja → quase branco com brilho, enchendo com mola.
export const ProgressBar: React.FC<IProgressBarProps> = ({
	value,
	max = DEFAULT_MAX,
	label,
	valueLabel,
	height = DEFAULT_HEIGHT,
	tone = "accent",
	delay = 0,
	style,
}) => {
	const { theme } = useTheme();
	const percent = Math.max(0, Math.min(100, (value / max) * 100));
	const fillStyle = useProgressFill(percent, delay);
	const styles = createProgressBarStyles(theme, { height, tone });

	return (
		<View
			style={[styles.root, style]}
			accessibilityRole="progressbar"
			accessibilityValue={{ min: 0, max, now: value }}
		>
			{label || valueLabel ? (
				<View style={styles.header}>
					<Text style={styles.label}>{label}</Text>
					<Text style={styles.valueLabel}>{valueLabel}</Text>
				</View>
			) : null}
			<View style={styles.track}>
				<Animated.View style={[styles.fill, fillStyle]}>
					<View style={styles.fillClip}>{tone === "accent" ? <ProgressGradient /> : null}</View>
				</Animated.View>
			</View>
		</View>
	);
};

export * from "./types";
