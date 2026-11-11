import React from "react";

import Animated from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { anim } from "../../../animations";

const FLAME = "M10 0 C14 8 20 12 18 20 C17 25 13 27 10 27 C7 27 3 25 2 20 C0 13 6 9 10 0 Z";
const FLAMES = [38, 60, 82] as const;

// Buddy Studio · fogo nos pés: chamas tremendo embaixo do Buddy
export const Fogo: React.FC = () => {
	const fire = useSvgId("pb-fire");
	return (
		<>
			{FLAMES.map((x, i) => (
				<Animated.View
					key={x}
					style={[
						{ position: "absolute", left: x, top: 94, width: 20, height: 27, zIndex: 2 },
						{ transformOrigin: "50% 100%" },
						anim("flick", "0.42s", { delay: `${String(i * 0.12)}s`, direction: "alternate" }),
					]}
					pointerEvents="none"
				>
					<Svg viewBox="0 0 20 27" width={20} height={27}>
						<Defs>
							<LinearGradient id={fire} x1="0" y1="0" x2="0" y2="1">
								<Stop offset="0" stopColor="#FFD23F" />
								<Stop offset="0.55" stopColor="#FD7A1E" />
								<Stop offset="1" stopColor="#E84A00" />
							</LinearGradient>
						</Defs>
						<Path d={FLAME} fill={`url(#${fire})`} />
						<Path
							d="M10 10 C12 14 14 16 13 20 C12 23 8 23 7 20 C6 16 8 14 10 10 Z"
							fill="#FFF1B8"
						/>
					</Svg>
				</Animated.View>
			))}
		</>
	);
};
