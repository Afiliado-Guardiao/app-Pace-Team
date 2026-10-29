import React from "react";
import { Pressable, View } from "react-native";

import Animated from "react-native-reanimated";

import { BuddyFigure } from "../BuddyFigure";

import { useBuddyRunner } from "./hooks/useBuddyRunner";
import { LifeBar } from "./LifeBar";
import { createBuddyRunnerStyles } from "./styles";

interface IBuddyRunnerProps {
	// Altura do chão (onde pisa), contada do topo do bloco onde ele está
	feetY: number;
	// Distância do bloco até a borda esquerda da tela (para cruzar a tela toda)
	offsetLeft?: number;
	testID?: string;
}

const HIT_SLOP = 10;

// Buddy pequenininho correndo pela tela, por trás dos cards e botões: deve
// ser o primeiro filho do bloco, para tudo o que vem depois ficar na frente.
export const BuddyRunner: React.FC<IBuddyRunnerProps> = ({
	feetY,
	offsetLeft = 0,
	testID = "buddy-runner",
}) => {
	const runner = useBuddyRunner();
	const styles = createBuddyRunnerStyles({ feetY, offsetLeft, width: runner.width }, runner.dir);
	if (!runner.isVisible) return null;

	return (
		<View
			ref={runner.trackRef}
			onLayout={runner.onTrackLayout}
			style={styles.track}
			pointerEvents="box-none"
		>
			<Animated.View style={[styles.mover, runner.moveStyle]}>
				<Pressable
					testID={testID}
					accessibilityRole="button"
					accessibilityLabel="Seu Buddy"
					hitSlop={HIT_SLOP}
					onPress={runner.open}
					style={styles.body}
				>
					<View style={styles.figure} pointerEvents="none">
						<BuddyFigure
							pose={runner.pose}
							color={runner.look.color}
							accessories={runner.look.accessories}
						/>
					</View>
				</Pressable>
				<LifeBar life={runner.life} hasPoint={runner.hasPoint} />
			</Animated.View>
		</View>
	);
};
