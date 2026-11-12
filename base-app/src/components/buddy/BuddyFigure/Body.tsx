import React from "react";
import { Image, ImageStyle, View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import {
	BUDDY_ACC_ORDER,
	BUDDY_BACK_ACCESSORIES,
	BUDDY_COLORS,
	IBuddyAccessoryId,
	IBuddyBackAccessoryId,
	IBuddyPalette,
} from "@/lib/buddy/constants";

import { anim, EASE_SPRING } from "../animations";

import { HeadAccessory } from "./accessories/HeadAccessory";
import { BODY_H, BODY_LEFT, BODY_TOP, BODY_W, BUD_ART, FACE_TOP } from "./budArt";
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

const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };
// Domo do corpo (para recortar o brilho dos metálicos)
const DOME: ViewStyle = {
	...FILL,
	overflow: "hidden",
	borderTopLeftRadius: BODY_W / 2,
	borderTopRightRadius: BODY_W / 2,
	borderBottomLeftRadius: 30,
	borderBottomRightRadius: 30,
};
const FACE: ViewStyle = { position: "absolute", left: 0, top: FACE_TOP, width: BODY_W, height: 70 };
const SHEEN_WIDE: ViewStyle = {
	position: "absolute",
	top: -20,
	bottom: -20,
	width: 30,
	backgroundColor: "rgba(255,255,255,.55)",
	transform: [{ skewX: "-20deg" }],
};
const CHEEK: ViewStyle = {
	position: "absolute",
	top: 40,
	width: 16,
	height: 9,
	borderRadius: 8,
	backgroundColor: "rgba(255,72,60,.55)",
};
const ART: ImageStyle = { width: BODY_W, height: BODY_H };
const OVER: ImageStyle = { position: "absolute", top: 0, left: 0, width: BODY_W, height: BODY_H };
const SICK = "#FF402C";

// Cor do Buddy por cima do algodão: a arte tingida, meio transparente, deixa
// a luz e a sombra da arte aparecerem (o branco é a arte pura)
const tintOf = (pal: IBuddyPalette): string | null => {
	if (pal === BUDDY_COLORS.branco) return null;
	return pal.metal && pal.m ? pal.m[1] : pal.c[2];
};

const HATS: readonly IBuddyAccessoryId[] = ["bone", "boneTras", "faixa", "aureola"];
const CROWN_LIFT = 14;

// Corpo do Buddy (o "marshmallow"): degradê, sombras, rosto e acessórios.
export const Body: React.FC<IBodyProps> = ({ pose, pal, accessories, dropId, isMini }) => {
	const isSleep = isSleepAct(pose.act);
	const isSick = pose.act === "sick";
	const heads = accessories
		.filter(
			(x): x is Exclude<IBuddyAccessoryId, IBuddyBackAccessoryId> =>
				!(BUDDY_BACK_ACCESSORIES as readonly string[]).includes(x),
		)
		.sort((a, b) => BUDDY_ACC_ORDER.indexOf(a) - BUDDY_ACC_ORDER.indexOf(b));
	// A coroa do líder sobe quando há boné, faixa ou auréola
	const crownLift = heads.some((x) => HATS.includes(x)) ? CROWN_LIFT : 0;

	const tint = tintOf(pal);

	return (
		<Animated.View
			style={[
				{
					position: "absolute",
					left: BODY_LEFT,
					top: BODY_TOP,
					width: BODY_W,
					height: BODY_H,
					zIndex: 3,
					transformOrigin: "50% 100%",
				},
				{ transform: [{ scaleX: isSleep ? 1.07 : 1 }, { scaleY: isSleep ? 0.86 : 1 }] },
				{
					transitionProperty: "transform",
					transitionDuration: "0.5s",
					transitionTimingFunction: EASE_SPRING,
				},
			]}
		>
			<Image source={BUD_ART.body} style={ART} resizeMode="contain" />
			{tint ? (
				<Image
					source={BUD_ART.body}
					style={[OVER, { tintColor: tint, opacity: pal.metal ? 0.62 : 0.55 }]}
					resizeMode="contain"
				/>
			) : null}
			{pal.metal && !isMini ? (
				<View style={DOME} pointerEvents="none">
					<Animated.View style={[SHEEN_WIDE, anim("sheen", "2.6s")]} />
				</View>
			) : null}
			{isSick ? (
				<Animated.View style={[FILL, isMini ? null : anim("flush", "1.6s")]} pointerEvents="none">
					<Image
						source={BUD_ART.body}
						style={[OVER, { tintColor: SICK, opacity: 0.24 }]}
						resizeMode="contain"
					/>
					<View style={FACE}>
						<View style={[CHEEK, { left: 12 }]} />
						<View style={[CHEEK, { right: 12 }]} />
					</View>
				</Animated.View>
			) : null}
			<View style={FACE} pointerEvents="none">
				<Eyes pose={pose} />
				<Mouth act={pose.act} />
				{heads.map((id) => (
					<HeadAccessory
						key={id}
						id={id}
						pal={pal}
						isNew={!isMini && dropId === id}
						crownLift={crownLift}
					/>
				))}
			</View>
		</Animated.View>
	);
};
