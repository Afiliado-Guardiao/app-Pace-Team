import React from "react";

import Animated from "react-native-reanimated";

import { IBuddyPalette } from "@/lib/buddy/constants";

import { anim } from "../animations";

import { Rays } from "./effects/Rays";
import { ShakeArcs } from "./effects/ShakeArcs";
import { CELEBRATE, GLYPH, GOLD, IMPRESSED, METAL } from "./effects/shared";
import { SleepZ } from "./effects/SleepZ";
import { Sparkles } from "./effects/Sparkles";
import { Sweat } from "./effects/Sweat";
import { IBuddyPose, isSleepAct } from "./pose";

interface IEffectsProps {
	pose: IBuddyPose;
	pal: IBuddyPalette;
}

// Efeitos em volta do Buddy conforme o gesto (raios, ondas, Z, suor, ?, !, brilhos).
export const Effects: React.FC<IEffectsProps> = ({ pose, pal }) => {
	const { act: a } = pose;
	const isCel = a === "celebrate";

	return (
		<>
			{a === "excited" || a === "armsUp" ? <Rays /> : null}
			{a === "shake" ? <ShakeArcs /> : null}
			{isSleepAct(a) ? <SleepZ /> : null}
			{a === "sick" ? <Sweat /> : null}
			{a === "curious" ? (
				<Animated.Text
					style={[{ ...GLYPH, left: 114, top: 0, fontSize: 28, zIndex: 5 }, anim("q", "1.4s")]}
				>
					?
				</Animated.Text>
			) : null}
			{a === "impressed" ? (
				<>
					<Animated.Text
						style={[{ ...GLYPH, left: 116, top: 0, fontSize: 30, zIndex: 5 }, anim("q", "0.9s")]}
					>
						!
					</Animated.Text>
					<Sparkles list={IMPRESSED} colors={["#FF9A5C", "#FFFFFF"]} duration="0.9s" step={0.18} />
				</>
			) : null}
			{pal.metal && !isCel ? (
				<Sparkles
					list={pal.spark ? GOLD : METAL}
					colors={[pal.ink ?? "#FFFFFF", "#FFFFFF"]}
					duration="1.8s"
					step={0.45}
					glow={pal.glow}
				/>
			) : null}
			{isCel ? (
				<Sparkles list={CELEBRATE} colors={["#FF9A5C", "#FFFFFF"]} duration="1.1s" step={0.2} />
			) : null}
		</>
	);
};
