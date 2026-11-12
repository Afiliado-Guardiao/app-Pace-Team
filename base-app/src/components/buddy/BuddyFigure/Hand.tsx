import React from "react";
import { ImageSourcePropType, ImageStyle, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { BUDDY_COLORS, IBuddyPalette } from "@/lib/buddy/constants";

import { EASE_SPRING } from "../animations";

import { BUD_ART, HAND_BOX } from "./budArt";
import { handAnimation, handPositions, IBuddyPose, isRingPhase, isSleepAct } from "./pose";

interface IHandProps {
	pose: IBuddyPose;
	pal: IBuddyPalette;
	index: 0 | 1;
	isMini: boolean;
}

const SPRING_T = {
	transitionProperty: "transform",
	transitionDuration: "0.38s",
	transitionTimingFunction: EASE_SPRING,
} as const;
const FADE = { transitionProperty: "opacity", transitionDuration: "0.16s" } as const;
const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

const tintOf = (pal: IBuddyPalette): string | null => {
	if (pal === BUDDY_COLORS.branco) return null;
	return pal.metal && pal.m ? pal.m[1] : pal.c[2];
};

// Uma camada da mão (arte + cor por cima, como no corpo), em tamanho fixo
const HandArt: React.FC<{
	source: ImageSourcePropType;
	box: { left: number; top: number; width: number; height: number };
	tint: string | null;
	opacity: number;
}> = ({ source, box, tint, opacity }) => {
	const art: ImageStyle = {
		position: "absolute",
		left: 0,
		top: 0,
		width: box.width,
		height: box.height,
	};
	return (
		<Animated.View style={[{ position: "absolute", ...box, opacity }, FADE]} pointerEvents="none">
			<Animated.Image source={source} style={art} resizeMode="stretch" />
			{tint ? (
				<Animated.Image
					source={source}
					style={[art, { tintColor: tint, opacity: 0.55 }]}
					resizeMode="stretch"
				/>
			) : null}
		</Animated.View>
	);
};

// Mãozinha do Bud: parada, é a mão da arte encaixada no corpo; quando
// gesticula, vira a esfera inteira e estica um pouco (como um braço de algodão)
export const Hand: React.FC<IHandProps> = ({ pose, pal, index, isMini }) => {
	const [hx, hy] = handPositions(pose)[index];
	const isRing = isRingPhase(pose.phase);
	const isMoving = !isMini && !isSleepAct(pose.act) && (hy < 0 || isRing);
	const motion = handAnimation(pose, index, isMini);
	const isAway = isMoving || hx !== 0 || hy !== 0 || motion !== null;
	const angle = isMoving ? (isRing ? -58 : index ? 30 : -30) : 0;
	const full = index ? HAND_BOX.handRFull : HAND_BOX.handLFull;
	const rest = index ? HAND_BOX.handR : HAND_BOX.handL;
	const tint = tintOf(pal);

	return (
		<Animated.View
			style={[
				{ position: "absolute", ...full, zIndex: 4 },
				{ transform: [{ translateX: hx }, { translateY: hy }] },
				SPRING_T,
			]}
			pointerEvents="none"
		>
			<Animated.View style={[FILL, { transform: [{ rotate: `${String(angle)}deg` }] }, SPRING_T]}>
				<Animated.View
					style={[
						FILL,
						{
							transformOrigin: "50% 100%",
							transform: [{ scaleX: isMoving ? 0.82 : 1 }, { scaleY: isMoving ? 1.22 : 1 }],
						},
						SPRING_T,
						motion,
					]}
				>
					<HandArt
						source={index ? BUD_ART.handRFull : BUD_ART.handLFull}
						box={{ left: 0, top: 0, width: full.width, height: full.height }}
						tint={tint}
						opacity={isAway ? 1 : 0}
					/>
					<HandArt
						source={index ? BUD_ART.handR : BUD_ART.handL}
						box={{
							left: rest.left - full.left,
							top: rest.top - full.top,
							width: rest.width,
							height: rest.height,
						}}
						tint={tint}
						opacity={isAway ? 0 : 1}
					/>
				</Animated.View>
			</Animated.View>
		</Animated.View>
	);
};
