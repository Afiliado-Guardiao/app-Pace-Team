import React from "react";
import { ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { IBuddyAccessoryId, IBuddyPalette } from "@/lib/buddy/constants";

import { anim, EASE_OUT } from "../../animations";

import { Aureola } from "./Aureola";
import { Bone } from "./Bone";
import { BoneTras } from "./BoneTras";
import { Coroa } from "./Coroa";
import { Faixa } from "./Faixa";
import { Fone } from "./Fone";
import { Glasses } from "./Glasses";
import { Grau } from "./Grau";
import { Viseira } from "./Viseira";

interface IHeadAccessoryProps {
	id: Exclude<IBuddyAccessoryId, "capa">;
	pal: IBuddyPalette;
	// Recém-vestido: cai em cima do Buddy
	isNew: boolean;
	// Coroa por cima de outro acessório de cabeça
	crownLift?: number;
}

// Buddy Studio: faixa neon (rosa → roxo) e lente espelhada (azul → prata)
const NEON_LAYERS = [
	{
		type: "linear" as const,
		angle: 90,
		stops: [
			{ offset: 0, color: "#FF4FD8" },
			{ offset: 0.5, color: "#B44CFF" },
			{ offset: 1, color: "#4FC3FF" },
		],
	},
];
const NEON_TAILS = ["#B44CFF", "#4FC3FF"] as const;
const MIRROR = ["#E8FBFF", "#7FD6FF", "#3A7BD5", "#1B2F6B"] as const;

const DROP = anim("drop", "0.8s", { timing: EASE_OUT, delay: "0.35s", count: 1, fill: "both" });
const LAYER: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 };

// Acessório de cabeça/olhos desenhado sobre o corpo (coordenadas do design).
export const HeadAccessory: React.FC<IHeadAccessoryProps> = ({ id, pal, isNew, crownLift }) => {
	const fill = pal.metal ? (pal.m?.[1] ?? pal.c[1]) : pal.c[1];
	const parts: Record<IHeadAccessoryProps["id"], React.ReactNode> = {
		faixa: <Faixa />,
		oculos: <Glasses />,
		bone: <Bone />,
		grau: <Grau />,
		boneTras: <BoneTras fill={fill} />,
		coroa: <Coroa lift={crownLift} />,
		aureola: <Aureola />,
		fone: <Fone />,
		viseira: <Viseira />,
		faixaNeon: <Faixa layers={NEON_LAYERS} tails={NEON_TAILS} glow="rgba(180,76,255,.7)" />,
		espelhado: <Glasses lens={MIRROR} rim="#BFE9FF" />,
	};
	return (
		<Animated.View style={[LAYER, isNew ? DROP : null]} pointerEvents="none">
			{parts[id]}
		</Animated.View>
	);
};
