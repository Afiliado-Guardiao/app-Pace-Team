import React from "react";

import Animated from "react-native-reanimated";

import { IBuddyEffectId } from "@/lib/buddy/constants";

import { anim } from "../../animations";

import { CELEBRATE, ISpark } from "./shared";
import { Sparkles } from "./Sparkles";

interface IStudioEffectProps {
	effect: IBuddyEffectId;
}

const STARS: readonly ISpark[] = [
	[10, 24, 10],
	[112, 10, 12],
	[126, 70, 9],
	[0, 78, 8],
	[64, -4, 9],
	[94, 104, 7],
];

// Buddy Studio: efeito que acompanha o Buddy o tempo todo (só estilo)
export const StudioEffect: React.FC<IStudioEffectProps> = ({ effect }) => {
	if (effect === "faiscas") {
		return (
			<Sparkles list={CELEBRATE} colors={["#FF9A5C", "#FFD27A"]} duration="1.4s" step={0.28} />
		);
	}
	if (effect === "estrelas") {
		return (
			<Sparkles
				list={STARS}
				colors={["#FFFFFF", "#9FD8FF"]}
				duration="2.2s"
				step={0.36}
				glow="rgba(159,216,255,.8)"
			/>
		);
	}
	return (
		<Animated.View
			style={[
				{
					position: "absolute",
					left: 10,
					top: 18,
					width: 120,
					height: 98,
					borderRadius: 60,
					backgroundColor: "rgba(253,90,12,.28)",
					zIndex: 0,
					boxShadow: "0 0 34px 12px rgba(253,90,12,.55)",
				},
				anim("aura", "2.2s"),
			]}
		/>
	);
};
