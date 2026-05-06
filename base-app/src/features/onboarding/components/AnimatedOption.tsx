import React, { cloneElement, isValidElement, memo } from "react";

import Animated from "react-native-reanimated";

import { useAnimatedOption } from "../hooks/useAnimatedOption";
import { usePressAnimation } from "../hooks/usePressAnimation";

interface IAnimatedOptionProps {
	index: number;
	children: React.ReactNode;
}

const AnimatedOptionComponent: React.FC<IAnimatedOptionProps> = ({ index, children }) => {
	const { entryAnimatedStyle } = useAnimatedOption(index);
	const { animatedStyle: pressAnimatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

	const combinedStyle = [entryAnimatedStyle, pressAnimatedStyle];

	const childWithHandlers = isValidElement(children)
		? cloneElement(
				children as React.ReactElement<{ onPressIn?: () => void; onPressOut?: () => void }>,
				{
					onPressIn: handlePressIn,
					onPressOut: handlePressOut,
				},
			)
		: children;

	return <Animated.View style={combinedStyle}>{childWithHandlers}</Animated.View>;
};

AnimatedOptionComponent.displayName = "AnimatedOption";

export const AnimatedOption = memo(AnimatedOptionComponent);
