import React from "react";
import { Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { anim } from "../animations";

import { createLifeBarStyles } from "./styles/lifeBar";

interface ILifeBarProps {
	// Vida de 0 a 1
	life: number;
	// Mostra o "+1" subindo (correu hoje e está comemorando)
	hasPoint: boolean;
}

// Barrinha de vida em cima da cabeça do Buddy corredor
export const LifeBar: React.FC<ILifeBarProps> = ({ life, hasPoint }) => {
	const { theme } = useTheme();
	const styles = createLifeBarStyles(theme, life);

	return (
		<View style={styles.root} pointerEvents="none">
			{hasPoint ? (
				<Animated.View style={[styles.point, anim("pointUp", "1.3s", { count: 2 })]}>
					<Text style={styles.pointText}>+1</Text>
				</Animated.View>
			) : null}
			<View style={styles.track}>
				<View style={styles.fill} />
			</View>
		</View>
	);
};
