import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { CountUp } from "../../core/CountUp";
import { Icon } from "../../core/Icon";

import { createStatTileStyles } from "./styles";
import { IStatTileProps } from "./types";

const ICON_SIZE = 15;

// Métrica com ícone em círculo de vidro, rótulo, valor animado e unidade.
export const StatTile: React.FC<IStatTileProps> = ({
	icon,
	label,
	value,
	unit,
	sub,
	accent = false,
	size = "md",
	style,
}) => {
	const { theme } = useTheme();
	const styles = createStatTileStyles(theme, { size, accent });
	const content =
		typeof value === "string" || typeof value === "number" ? <CountUp value={value} /> : value;

	return (
		<View style={[styles.root, style]}>
			{icon || label ? (
				<View style={styles.header}>
					{icon ? (
						<View style={styles.iconDot}>
							<Icon name={icon} size={ICON_SIZE} color={styles.iconColor} />
						</View>
					) : null}
					{label ? <Text style={styles.label}>{label}</Text> : null}
				</View>
			) : null}
			<View style={styles.valueRow}>
				<Text style={styles.value}>{content}</Text>
				{unit ? <Text style={styles.unit}>{unit}</Text> : null}
			</View>
			{sub ? <Text style={styles.sub}>{sub}</Text> : null}
		</View>
	);
};

export * from "./types";
