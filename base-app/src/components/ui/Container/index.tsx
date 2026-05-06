import React from "react";
import { View } from "react-native";

import { useTheme } from "@/theme";

import { createContainerStyles } from "./styles";
import { IContainerProps } from "./types";

export const Container: React.FC<IContainerProps> = (props) => {
	const { theme } = useTheme();
	const styles = createContainerStyles(theme, props);

	return <View style={[styles, props.style]}>{props.children}</View>;
};

export * from "./types";
