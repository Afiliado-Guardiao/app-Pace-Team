import React from "react";

import Svg, { Circle, Path } from "react-native-svg";

import { useTheme } from "@/theme";

import { routePath } from "./routePath";

// Traçados estilizados de rota (miniatura dos cards da prévia, sem GPS)
const SHAPES = [
	"M10 50 C 6 30, 20 10, 34 12 S 58 22, 54 38 S 30 58, 18 52",
	"M8 40 L20 22 L34 30 L46 12 L56 26",
	"M12 14 C 30 6, 52 14, 50 30 S 26 40, 20 54 L 44 54",
	"M10 32 C 18 10, 46 10, 54 30 S 30 56, 10 32",
];
const STROKE = 3;
const DEFAULT_SIZE = 64;
const DOT = 3.2;

interface IMiniRouteProps {
	seed?: number;
	size?: number;
	// Percurso real gravado pelo GPS (lat, lng). Quando vem, desenha ele no
	// lugar dos traçados de exemplo.
	route?: readonly (readonly [number, number])[];
}

export const MiniRoute: React.FC<IMiniRouteProps> = ({ seed = 0, size = DEFAULT_SIZE, route }) => {
	const { theme } = useTheme();
	const real = route ? routePath(route) : null;
	const d = route ? (real?.d ?? "") : SHAPES[seed % SHAPES.length];

	return (
		<Svg width={size} height={size} viewBox="0 0 64 64">
			<Path
				d={d}
				fill="none"
				stroke={theme.pace.colors.route}
				strokeWidth={STROKE}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{real ? (
				<>
					<Circle
						cx={real.start[0]}
						cy={real.start[1]}
						r={DOT}
						fill={theme.pace.colors.bgApp}
						stroke={theme.pace.colors.textPrimary}
						strokeWidth={1.5}
					/>
					<Circle cx={real.end[0]} cy={real.end[1]} r={DOT} fill={theme.pace.colors.route} />
				</>
			) : null}
		</Svg>
	);
};
