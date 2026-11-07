import React from "react";

import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "@/theme";

import { usePrizeRays } from "./hooks/usePrizeRays";

interface IPrizeRaysProps {
	size: number;
}

const RAYS = 18;

const rayPath = (size: number, k: number): string => {
	const c = size / 2;
	const a0 = (k / RAYS) * Math.PI * 2;
	const a1 = a0 + Math.PI / (RAYS * 1.6);
	const p = (a: number) =>
		`${(c + Math.cos(a) * c).toFixed(1)} ${(c + Math.sin(a) * c).toFixed(1)}`;
	return `M${String(c)} ${String(c)} L${p(a0)} L${p(a1)} Z`;
};

// Raios de luz girando devagar atrás do prêmio
export const PrizeRays: React.FC<IPrizeRaysProps> = ({ size }) => {
	const { theme } = useTheme();
	const spin = usePrizeRays();

	return (
		<Animated.View
			style={[{ position: "absolute", width: size, height: size }, spin]}
			pointerEvents="none"
		>
			<Svg width={size} height={size}>
				{Array.from({ length: RAYS }, (_, k) => (
					<Path
						key={k}
						d={rayPath(size, k)}
						fill={k % 2 ? theme.pace.colors.accent : theme.pace.colors.rankGold}
						opacity={k % 2 ? 0.1 : 0.07}
					/>
				))}
			</Svg>
		</Animated.View>
	);
};
