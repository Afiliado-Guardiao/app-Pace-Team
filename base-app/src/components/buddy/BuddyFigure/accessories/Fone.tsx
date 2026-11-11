import React from "react";
import { View } from "react-native";

import { GradientLayers } from "@/components/pace";

import { ORANGE_LAYERS } from "../../palette";

import { abs, NAVY } from "./shared";

const CUP_W = 17;
const CUP_H = 28;

const Cup: React.FC<{ left: number }> = ({ left }) => (
	<View
		style={abs({
			left,
			top: 20,
			width: CUP_W,
			height: CUP_H,
			borderRadius: 9,
			overflow: "hidden",
			boxShadow: "0 4px 6px -2px rgba(0,0,0,.5), inset 0 1.5px 0 rgba(255,255,255,.5)",
		})}
	>
		<GradientLayers layers={ORANGE_LAYERS} width={CUP_W} height={CUP_H} />
	</View>
);

// Buddy Studio · fone de ouvido: arco escuro por cima e conchas laranja
export const Fone: React.FC = () => (
	<>
		<View
			style={abs({
				left: -4,
				top: -13,
				width: 96,
				height: 56,
				borderWidth: 6,
				borderBottomWidth: 0,
				borderColor: NAVY,
				borderTopLeftRadius: 48,
				borderTopRightRadius: 48,
				boxShadow: "0 -1px 0 rgba(255,255,255,.25)",
			})}
		/>
		<Cup left={-11} />
		<Cup left={82} />
	</>
);
