import React from "react";
import { View } from "react-native";

import { useTheme } from "@/theme";

const DOT = 8;

// Ponto de status do GPS: verde = pronto, âmbar = procurando.
export const GpsDot: React.FC<{ ok: boolean }> = ({ ok }) => {
	const { theme } = useTheme();
	const { colors } = theme.pace;

	return (
		<View
			style={{
				width: DOT,
				height: DOT,
				borderRadius: DOT / 2,
				backgroundColor: ok ? colors.statusSuccess : colors.statusWarning,
				boxShadow: ok ? "0 0 8px rgba(47,208,138,.9)" : "0 0 8px rgba(255,181,71,.9)",
			}}
		/>
	);
};
