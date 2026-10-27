import React from "react";
import { View } from "react-native";

import { GradientLayers } from "@/components/pace";

import { ORANGE_LAYERS } from "../../palette";

import { abs } from "./shared";

export const Faixa: React.FC = () => (
	<>
		<View
			style={abs({
				left: -3,
				right: -3,
				top: 6,
				height: 13,
				borderRadius: 7,
				overflow: "hidden",
				boxShadow: "0 3px 6px -2px rgba(205,54,0,.6), inset 0 1.5px 0 rgba(255,255,255,.45)",
			})}
		>
			<GradientLayers layers={ORANGE_LAYERS} width={94} height={13} />
		</View>
		<View
			style={abs({
				left: 82,
				top: 13,
				width: 14,
				height: 6,
				borderRadius: 3,
				backgroundColor: "#FD5A0C",
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
				backgroundColor: "#E84A00",
				transform: [{ rotate: "58deg" }],
			})}
		/>
	</>
);
