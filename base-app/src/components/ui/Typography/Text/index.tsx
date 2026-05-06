import React from "react";
import { Text as RNText } from "react-native";

import { useTheme } from "@/theme";

import { ITextProps } from "../types";

import { createTextStyles } from "./styles";

export const Text: React.FC<ITextProps> = ({
	children,
	variant = "body",
	style,
	numberOfLines,
}) => {
	const { theme } = useTheme();
	const styles = createTextStyles(theme, variant);

	return (
		<RNText style={[styles, style]} numberOfLines={numberOfLines}>
			{children}
		</RNText>
	);
};
