import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { GradientLayers } from "@/components/pace";
import { BUDDY_ACC_ORDER, IBuddyAccessoryId, IBuddyPalette } from "@/lib/buddy/constants";

import { anim, EASE_SPRING } from "../../animations";
import { bodyInsetShadow, bodyLayers, bodyOuterShadow, chromeLayers } from "../../palette";

import { HeadAccessory } from "./accessories/HeadAccessory";
import { Eyes } from "./Eyes";
import { Mouth } from "./Mouth";
import { IBuddyPose, isSleepAct } from "./pose";

interface IBodyProps {
	pose: IBuddyPose;
	pal: IBuddyPalette;
	accessories: readonly IBuddyAccessoryId[];
	dropId: IBuddyAccessoryId | null;
	isMini: boolean;
}

const W = 88;
const H = 70;
// borderRadius "36px 36px 30px 30px / 34px 34px 28px 28px"
const RADIUS: ViewStyle = {
	borderTopLeftRadius: 35,
	borderTopRightRadius: 35,
	borderBottomLeftRadius: 29,
	borderBottomRightRadius: 29,
};
const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };
const SHEEN_WIDE: ViewStyle = {
	position: "absolute",
	top: -20,
	bottom: -20,
	width: 30,
	backgroundColor: "rgba(255,255,255,.75)",
	transform: [{ skewX: "-20deg" }],
};
const SHEEN_THIN: ViewStyle = {
	position: "absolute",
	top: -20,
	bottom: -20,
	width: 9,
	backgroundColor: "rgba(255,255,255,.85)",
	transform: [{ skewX: "-20deg" }],
};
const CHEEK: ViewStyle = {
	position: "absolute",
	top: 40,
	width: 16,
	height: 9,
	borderRadius: 8,
	backgroundColor: "rgba(255,72,60,.6)",
};

// Corpo do Buddy (o "marshmallow"): degradê, sombras, rosto e acessórios.
export const Body: React.FC<IBodyProps> = ({ pose, pal, accessories, dropId, isMini }) => {
	const isSleep = isSleepAct(pose.act);
	const isSick = pose.act === "sick";
	const heads = accessories
		.filter((x): x is Exclude<IBuddyAccessoryId, "capa"> => x !== "capa")
		.sort((a, b) => BUDDY_ACC_ORDER.indexOf(a) - BUDDY_ACC_ORDER.indexOf(b));

	return (
		<Animated.View
			style={[
				{
					position: "absolute",
					left: 26,
					top: 32,
					width: W,
					height: H,
					zIndex: 3,
					transformOrigin: "50% 100%",
					boxShadow: bodyOuterShadow(pal),
				},
				RADIUS,
				{ transform: [{ scaleX: isSleep ? 1.07 : 1 }, { scaleY: isSleep ? 0.86 : 1 }] },
				{
					transitionProperty: "transform",
					transitionDuration: "0.5s",
					transitionTimingFunction: EASE_SPRING,
				},
			]}
		>
			<View style={[FILL, RADIUS, { overflow: "hidden" }]} pointerEvents="none">
				<GradientLayers
					layers={pal.metal ? chromeLayers(pal, true) : bodyLayers(pal)}
					width={W}
					height={H}
				/>
				{pal.metal && !isMini ? (
					<>
						<Animated.View style={[SHEEN_WIDE, anim("sheen", "2.6s")]} />
						<Animated.View style={[SHEEN_THIN, anim("sheen", "2.6s", { delay: "0.16s" })]} />
					</>
				) : null}
				{isSick ? (
					<Animated.View
						style={[
							FILL,
							{ backgroundColor: "rgba(255,64,44,.22)" },
							isMini ? null : anim("flush", "1.6s"),
						]}
					>
						<View style={[CHEEK, { left: 10 }]} />
						<View style={[CHEEK, { right: 10 }]} />
					</Animated.View>
				) : null}
			</View>
			<View style={[FILL, RADIUS, { boxShadow: bodyInsetShadow(pal) }]} pointerEvents="none" />
			<Eyes pose={pose} />
			<Mouth act={pose.act} />
			{heads.map((id) => (
				<HeadAccessory key={id} id={id} pal={pal} isNew={!isMini && dropId === id} />
			))}
		</Animated.View>
	);
};
