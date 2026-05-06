import React from "react";
import { View } from "react-native";

import { useTheme } from "@/theme";

import { createProgressBarStyles } from "../styles";
import { IProgressBarProps } from "../types";

export const ProgressBar: React.FC<IProgressBarProps> = ({ progress }) => {
	const { theme } = useTheme();
	const styles = createProgressBarStyles(theme, progress);

	return (
		<View style={styles.container}>
			<View style={styles.fill} />
		</View>
	);
};
