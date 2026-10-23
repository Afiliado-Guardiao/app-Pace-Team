import React from "react";

import Svg, { Path } from "react-native-svg";

import { useTheme } from "@/theme";

// Traçados estilizados de rota (miniatura dos cards de corrida)
const SHAPES = [
	"M10 50 C 6 30, 20 10, 34 12 S 58 22, 54 38 S 30 58, 18 52",
	"M8 40 L20 22 L34 30 L46 12 L56 26",
	"M12 14 C 30 6, 52 14, 50 30 S 26 40, 20 54 L 44 54",
	"M10 32 C 18 10, 46 10, 54 30 S 30 56, 10 32",
];
const STROKE = 3;
const DEFAULT_SIZE = 64;

interface IMiniRouteProps {
	seed?: number;
	size?: number;
}

export const MiniRoute: React.FC<IMiniRouteProps> = ({ seed = 0, size = DEFAULT_SIZE }) => {
	const { theme } = useTheme();

	return (
		<Svg width={size} height={size} viewBox="0 0 64 64">
			<Path
				d={SHAPES[seed % SHAPES.length]}
				fill="none"
				stroke={theme.pace.colors.route}
				strokeWidth={STROKE}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
};
