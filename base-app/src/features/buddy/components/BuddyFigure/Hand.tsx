import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { GradientLayers } from "@/components/pace";
import { IBuddyPalette } from "@/lib/buddy/constants";

import { EASE_SPRING } from "../../animations";
import { handLayers } from "../../palette";

import { handAnimation, handPositions, IBuddyPose, isRingPhase, isSleepAct } from "./pose";

interface IHandProps {
	pose: IBuddyPose;
	pal: IBuddyPalette;
	index: 0 | 1;
	isMini: boolean;
}

const BOX = 24;
const SPRING_T = {
	transitionProperty: "transform",
	transitionDuration: "0.38s",
	transitionTimingFunction: EASE_SPRING,
} as const;
const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

// Mãozinha do Buddy: bolinha parada ou "braço" esticado quando gesticula.
export const Hand: React.FC<IHandProps> = ({ pose, pal, index, isMini }) => {
	const [hx, hy] = handPositions(pose)[index];
	const isRing = isRingPhase(pose.phase);
	const isMoving = !isMini && !isSleepAct(pose.act) && (hy < 0 || isRing);
	const angle = isMoving ? (isRing ? -58 : index ? 30 : -30) : 0;
	const w = isMoving ? 17 : 24;
	const h = isMoving ? 34 : 24;

	return (
		<Animated.View
			style={[
				{
					position: "absolute",
					left: index ? 104 : 12,
					top: 68,
					width: BOX,
					height: BOX,
					zIndex: 4,
				},
				{ transform: [{ translateX: hx }, { translateY: hy }] },
				SPRING_T,
			]}
			pointerEvents="none"
		>
			<Animated.View style={[FILL, { transform: [{ rotate: `${String(angle)}deg` }] }, SPRING_T]}>
				<Animated.View
					style={[
						{
							position: "absolute",
							left: "50%",
							top: "50%",
							width: w,
							height: h,
							marginLeft: -w / 2,
							marginTop: -h / 2 - (isMoving ? 5 : 0),
							borderRadius: 999,
							overflow: "hidden",
							transformOrigin: "50% 100%",
							boxShadow: "inset -2px -3px 5px rgba(120,132,150,.35), 0 4px 8px -3px rgba(0,0,0,.5)",
						},
						{
							transitionProperty: ["width", "height", "marginLeft", "marginTop"],
							transitionDuration: "0.32s",
							transitionTimingFunction: EASE_SPRING,
						},
						handAnimation(pose, index, isMini),
					]}
				>
					<View style={FILL} pointerEvents="none">
						<GradientLayers layers={handLayers(pal)} width={24} height={34} />
					</View>
				</Animated.View>
			</Animated.View>
		</Animated.View>
	);
};
