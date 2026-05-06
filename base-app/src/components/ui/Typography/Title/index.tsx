import React from "react";
import { Text as RNText } from "react-native";

import { useTheme } from "@/theme";

import { ITitleProps } from "../types";

import { createTitleStyles } from "./styles";

export const Title: React.FC<ITitleProps> = ({ children, level = 1, style, numberOfLines }) => {
	const { theme } = useTheme();
	const styles = createTitleStyles(theme, level);

	return (
		<RNText style={[styles, style]} numberOfLines={numberOfLines}>
			{children}
		</RNText>
	);
};
