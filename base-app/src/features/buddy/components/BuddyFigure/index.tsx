import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { GradientLayers } from "@/components/pace";
import { IBuddyAccessoryId, IBuddyColorId } from "@/lib/buddy/constants";

import { anim, EASE_SPRING } from "../../animations";
import { paletteOf } from "../../palette";

import { Cape } from "./accessories/Cape";
import { Body } from "./Body";
import { Effects } from "./Effects";
import { Hand } from "./Hand";
import { groupAnimation, groupTransform, IBuddyPose, isRingPhase } from "./pose";
import { RunRing } from "./RunRing";

export type { IBuddyPose } from "./pose";

interface IBuddyFigureProps {
	pose: IBuddyPose;
	color: IBuddyColorId;
	accessories: readonly IBuddyAccessoryId[];
	// Acessório recém-vestido (anima caindo)
	dropId?: IBuddyAccessoryId | null;
	// Miniatura das listas (sem animações contínuas)
	isMini?: boolean;
}

export const BUDDY_W = 140;
export const BUDDY_H = 135;

const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };
const SHADOW_LAYERS = [
	{
		type: "radial" as const,
		cx: 0.5,
		cy: 0.5,
		rx: 0.5,
		ry: 0.5,
		stops: [
			{ offset: 0, color: "rgba(253,90,12,.45)" },
			{ offset: 1, color: "rgba(253,90,12,0)" },
		],
	},
];

// Pace Buddy desenhado como no design (140 × 135): sombra, aura metálica,
// capa, rastros/anel da corrida, corpo, mãos e efeitos.
export const BuddyFigure: React.FC<IBuddyFigureProps> = ({
	pose,
	color,
	accessories,
	dropId = null,
	isMini = false,
}) => {
	const pal = paletteOf(color);
	const isRing = isRingPhase(pose.phase);
	const hasCape = accessories.includes("capa");

	return (
		<View
			style={{ position: "relative", width: BUDDY_W, height: BUDDY_H }}
			pointerEvents="box-none"
		>
			<Animated.View
				style={[
					{
						position: "absolute",
						left: 30,
						top: 112,
						width: 80,
						height: 14,
						opacity: isRing ? 0 : 1,
					},
					{ transitionProperty: "opacity", transitionDuration: "0.3s" },
				]}
				pointerEvents="none"
			>
				<GradientLayers layers={SHADOW_LAYERS} width={80} height={14} />
			</Animated.View>
			<Animated.View
				style={[
					FILL,
					{ transformOrigin: "50% 75%", transform: groupTransform(pose) },
					{
						transitionProperty: "transform",
						transitionDuration: "0.45s",
						transitionTimingFunction: EASE_SPRING,
					},
				]}
				pointerEvents="none"
			>
				<Animated.View style={[FILL, { transformOrigin: "50% 90%" }, groupAnimation(pose, isMini)]}>
					{pal.metal ? (
						<Animated.View
							style={[
								{
									position: "absolute",
									left: 6,
									top: 14,
									width: 128,
									height: 104,
									borderRadius: 64,
									backgroundColor: pal.glow,
									opacity: 0.5,
									zIndex: 0,
									boxShadow: `0 0 30px 10px ${pal.glow ?? "transparent"}`,
								},
								isMini ? null : anim("aura", "2.2s"),
							]}
						/>
					) : null}
					{hasCape ? <Cape isNew={!isMini && dropId === "capa"} isMini={isMini} /> : null}
					{isMini ? null : <RunRing phase={pose.phase} />}
					<Body pose={pose} pal={pal} accessories={accessories} dropId={dropId} isMini={isMini} />
					<Hand pose={pose} pal={pal} index={0} isMini={isMini} />
					<Hand pose={pose} pal={pal} index={1} isMini={isMini} />
					{isMini ? null : <Effects pose={pose} pal={pal} />}
				</Animated.View>
			</Animated.View>
		</View>
	);
};
