import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { useEntrance } from "@/components/pace";

interface IPopInProps {
	style?: StyleProp<ViewStyle>;
	children: React.ReactNode;
}

// Entra com pop (use com key: cada troca de seção monta de novo e pula)
export const PopIn: React.FC<IPopInProps> = ({ style, children }) => {
	const pop = useEntrance("pop");
	return <Animated.View style={[style, pop]}>{children}</Animated.View>;
};
