import React from "react";
import { View } from "react-native";

import { GradientLayers } from "@/components/pace";
import { IGradientLayer } from "@/theme";

import { ORANGE_LAYERS } from "../../palette";

import { abs } from "./shared";

interface IFaixaProps {
	// Faixa neon do Buddy Studio: outro degradê e outras pontas
	layers?: IGradientLayer[];
	tails?: readonly [string, string];
	glow?: string;
}

export const Faixa: React.FC<IFaixaProps> = ({
	layers = ORANGE_LAYERS,
	tails = ["#FD5A0C", "#E84A00"],
	glow = "rgba(205,54,0,.6)",
}) => (
	<>
		<View
			style={abs({
				left: -3,
				right: -3,
				top: 6,
				height: 13,
				borderRadius: 7,
				overflow: "hidden",
				boxShadow: `0 3px 6px -2px ${glow}, inset 0 1.5px 0 rgba(255,255,255,.45)`,
			})}
		>
			<GradientLayers layers={layers} width={94} height={13} />
		</View>
		<View
			style={abs({
				left: 82,
				top: 13,
				width: 14,
				height: 6,
				borderRadius: 3,
				backgroundColor: tails[0],
				transform: [{ rotate: "28deg" }],
			})}
		/>
		<View
			style={abs({
				left: 80,
				top: 18,
				width: 12,
				height: 5,
				borderRadius: 3,
				backgroundColor: tails[1],
				transform: [{ rotate: "58deg" }],
			})}
		/>
	</>
);
