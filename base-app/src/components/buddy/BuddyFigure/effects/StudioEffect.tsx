import React from "react";

import Animated from "react-native-reanimated";

import { IBuddyEffectId } from "@/lib/buddy/constants";

import { anim } from "../../animations";

import { CELEBRATE, ISpark } from "./shared";
import { Sparkles } from "./Sparkles";
import { Chuva } from "./studio/Chuva";
import { Coracoes } from "./studio/Coracoes";
import { Fogo } from "./studio/Fogo";
import { Notas } from "./studio/Notas";
import { Raios } from "./studio/Raios";
import { Tontura } from "./studio/Tontura";

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

const Aura: React.FC = () => (
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

const EFFECTS: Record<IBuddyEffectId, React.ReactNode> = {
	tontura: <Tontura />,
	coracoes: <Coracoes />,
	notas: <Notas />,
	fogo: <Fogo />,
	chuva: <Chuva />,
	raios: <Raios />,
	faiscas: (
		<Sparkles list={CELEBRATE} colors={["#FF9A5C", "#FFD27A"]} duration="1.4s" step={0.28} />
	),
	estrelas: (
		<Sparkles
			list={STARS}
			colors={["#FFFFFF", "#9FD8FF"]}
			duration="2.2s"
			step={0.36}
			glow="rgba(159,216,255,.8)"
		/>
	),
	aura: <Aura />,
};

// Buddy Studio: efeito que acompanha o Buddy o tempo todo (só estilo)
export const StudioEffect: React.FC<IStudioEffectProps> = ({ effect }) => <>{EFFECTS[effect]}</>;
