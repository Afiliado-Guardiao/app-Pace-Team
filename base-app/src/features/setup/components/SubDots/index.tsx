import React from "react";
import { View } from "react-native";

import { ITheme, useTheme } from "@/theme";

interface ISubDotsProps {
	// Sub-etapa atual do Buddy (0, 1 ou 2)
	index: number;
}

const DOT = 6;
const ACTIVE = 18;
const ITEMS = [0, 1, 2] as const;

const createSubDotsStyles = (theme: ITheme) => ({
	root: { flexDirection: "row" as const, justifyContent: "center" as const, gap: 6 },
	dot: {
		width: DOT,
		height: DOT,
		borderRadius: DOT / 2,
		backgroundColor: theme.pace.colors.dotIdle,
	},
	on: { width: ACTIVE, backgroundColor: theme.pace.colors.textPrimary },
});

// Pontinhos das 3 telas do Buddy (acessório · me chame · cuide de mim)
export const SubDots: React.FC<ISubDotsProps> = ({ index }) => {
	const { theme } = useTheme();
	const styles = createSubDotsStyles(theme);

	return (
		<View style={styles.root}>
			{ITEMS.map((i) => (
				<View key={i} style={[styles.dot, i === index ? styles.on : null]} />
			))}
		</View>
	);
};
