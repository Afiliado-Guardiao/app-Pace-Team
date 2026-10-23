import React from "react";
import { ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { IBuddyAccessoryId, IBuddyPalette } from "@/lib/buddy/constants";

import { anim, EASE_OUT } from "../../../animations";

import { Aureola } from "./Aureola";
import { Bone } from "./Bone";
import { BoneTras } from "./BoneTras";
import { Coroa } from "./Coroa";
import { Faixa } from "./Faixa";
import { Glasses } from "./Glasses";
import { Grau } from "./Grau";

interface IHeadAccessoryProps {
	id: Exclude<IBuddyAccessoryId, "capa">;
	pal: IBuddyPalette;
	// Recém-vestido: cai em cima do Buddy
	isNew: boolean;
}

const DROP = anim("drop", "0.8s", { timing: EASE_OUT, delay: "0.35s", count: 1, fill: "both" });
const LAYER: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 };

// Acessório de cabeça/olhos desenhado sobre o corpo (coordenadas do design).
export const HeadAccessory: React.FC<IHeadAccessoryProps> = ({ id, pal, isNew }) => {
	const fill = pal.metal ? (pal.m?.[1] ?? pal.c[1]) : pal.c[1];
	const parts: Record<IHeadAccessoryProps["id"], React.ReactNode> = {
		faixa: <Faixa />,
		oculos: <Glasses />,
		bone: <Bone />,
		grau: <Grau />,
		boneTras: <BoneTras fill={fill} />,
		coroa: <Coroa />,
		aureola: <Aureola />,
	};
	return (
		<Animated.View style={[LAYER, isNew ? DROP : null]} pointerEvents="none">
			{parts[id]}
		</Animated.View>
	);
};
