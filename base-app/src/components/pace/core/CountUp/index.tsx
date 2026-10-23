import React from "react";
import { Text } from "react-native";

import { useTheme } from "@/theme";

import { useCountUp } from "./hooks/useCountUp";
import { createCountUpStyles } from "./styles";
import { ICountUpProps } from "./types";

const DEFAULT_DURATION = 1100;

// Número animado (pt-BR). Fica dentro de um <Text> pai e herda a fonte dele.
// Ritmos e tempos ("5'12\"", "45:25") aparecem como estão.
export const CountUp: React.FC<ICountUpProps> = ({
	value,
	duration = DEFAULT_DURATION,
	delay = 0,
}) => {
	const { theme } = useTheme();
	const { text, isNumeric } = useCountUp(value, { duration, delay });
	const styles = createCountUpStyles(theme);

	return <Text style={isNumeric ? styles.numeric : undefined}>{text}</Text>;
};

export * from "./types";
