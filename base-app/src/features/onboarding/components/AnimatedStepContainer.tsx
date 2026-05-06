import React from "react";

import Animated from "react-native-reanimated";

import { useAnimatedStepContainer } from "../hooks/useAnimatedStepContainer";
import { createAnimatedStepContainerStyles } from "../styles/AnimatedStepContainer";

interface IAnimatedStepContainerProps {
	children: React.ReactNode;
	direction: "forward" | "backward";
	stepIndex?: number;
}

export const AnimatedStepContainer: React.FC<IAnimatedStepContainerProps> = ({
	children,
	direction,
	stepIndex,
}) => {
	const { animatedStyle } = useAnimatedStepContainer(direction, stepIndex);
	const styles = createAnimatedStepContainerStyles();

	return <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>;
};
