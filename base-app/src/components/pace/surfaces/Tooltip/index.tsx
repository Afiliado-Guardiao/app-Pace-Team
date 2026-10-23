import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { GlassSurface } from "../../primitives";

import { createTooltipStyles } from "./styles";
import { ITooltipProps } from "./types";

// Balão pílula com seta (ex.: rótulo de ponto no gráfico). accent = laranja.
export const Tooltip: React.FC<ITooltipProps> = ({
	children,
	placement = "top",
	accent = false,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createTooltipStyles(theme, { placement, accent });

	return (
		<GlassSurface
			appearance={styles.appearance}
			radius={theme.pace.radii.pill}
			style={[styles.surface, style]}
		>
			<View style={styles.arrow} />
			{typeof children === "string" ? <Text style={styles.text}>{children}</Text> : children}
		</GlassSurface>
	);
};

export * from "./types";
