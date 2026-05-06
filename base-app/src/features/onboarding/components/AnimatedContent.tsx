import React from "react";

import Animated from "react-native-reanimated";

import { useAnimatedContent } from "../hooks/useAnimatedContent";

interface IAnimatedContentProps {
	children: React.ReactNode;
	triggerKey?: string;
}

export const AnimatedContent: React.FC<IAnimatedContentProps> = ({ children, triggerKey }) => {
	const { animatedStyle } = useAnimatedContent(triggerKey);

	return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
