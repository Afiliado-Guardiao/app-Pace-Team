import React from "react";

import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

const DARK = "#0E1218";
const SVG_STYLE = {
	position: "absolute",
	left: -8,
	top: 11,
	overflow: "visible",
	filter: "drop-shadow(0 4px 5px rgba(0,0,0,.45))",
} as const;

// Óculos esportivos laranja do Buddy (o mesmo desenho SVG do design).
export const Glasses: React.FC = () => {
	const lens = useSvgId("pb-lens");
	const shine = useSvgId("pb-shine");

	return (
		<Svg viewBox="0 0 100 32" width={104} height={33} style={SVG_STYLE}>
			<Defs>
				<LinearGradient id={lens} x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#FFD27A" />
					<Stop offset="0.35" stopColor="#FD7A1E" />
					<Stop offset="0.7" stopColor="#E84A00" />
					<Stop offset="1" stopColor="#8A2400" />
				</LinearGradient>
				<LinearGradient id={shine} x1="0" y1="0" x2="1" y2="0">
					<Stop offset="0" stopColor="#fff" stopOpacity={0} />
					<Stop offset="0.5" stopColor="#fff" stopOpacity={0.75} />
					<Stop offset="1" stopColor="#fff" stopOpacity={0} />
				</LinearGradient>
			</Defs>
			<Path d="M1 8 Q0 14 3 19 L6 18 Q4 13 5 9 Z" fill={DARK} />
			<Path d="M99 8 Q100 14 97 19 L94 18 Q96 13 95 9 Z" fill={DARK} />
			<Path
				d="M5 6 Q50 1 95 6 L96 12 Q95 24 84 27 Q70 29 60 26 Q55 17 50 16 Q45 17 40 26 Q30 29 16 27 Q5 24 4 12 Z"
				fill={`url(#${lens})`}
				stroke="#FF8A6A"
				strokeWidth={0.8}
				strokeOpacity={0.9}
			/>
			<Path d="M12 9 Q22 7 30 8 L20 24 Q13 23 11 18 Z" fill={`url(#${shine})`} opacity={0.55} />
			<Path d="M66 8 Q72 8 76 9 L70 25 Q66 25 63 24 Z" fill={`url(#${shine})`} opacity={0.35} />
			<Path d="M3 7 Q50 -1 97 7 L97 11 Q50 4 3 11 Z" fill={DARK} />
			<Path
				d="M8 6.5 Q50 0.5 92 6.5"
				fill="none"
				stroke="rgba(255,255,255,.35)"
				strokeWidth={0.8}
				strokeLinecap="round"
			/>
			<Path d="M44 8 Q50 6 56 8 L57.5 19 Q54 15.5 50 15.5 Q46 15.5 42.5 19 Z" fill={DARK} />
		</Svg>
	);
};
