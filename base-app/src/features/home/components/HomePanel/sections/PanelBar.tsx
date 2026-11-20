import React from "react";
import { View, ViewStyle } from "react-native";

import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { useTheme } from "@/theme";

import { ACRYLIC } from "../constants";

interface IPanelBarProps {
	fraction: number;
	grow: SharedValue<number>;
	height?: number;
}

// Barra de progresso fina que cresce quando a seção entra
export const PanelBar: React.FC<IPanelBarProps> = ({ fraction, grow, height = 6 }) => {
	const { theme } = useTheme();
	const track: ViewStyle = {
		height,
		borderRadius: height / 2,
		backgroundColor: ACRYLIC.glassBoxBorder,
		overflow: "hidden",
	};
	const fill: ViewStyle = {
		height,
		borderRadius: height / 2,
		backgroundColor: theme.pace.colors.accent,
	};
	const width = useAnimatedStyle(() => ({
		width: `${String(Math.max(0, fraction * grow.value * 100))}%` as `${number}%`,
	}));

	return (
		<View style={track}>
			<Animated.View style={[fill, width]} />
		</View>
	);
};
