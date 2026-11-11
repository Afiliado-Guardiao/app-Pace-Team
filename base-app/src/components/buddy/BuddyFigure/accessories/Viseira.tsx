import React from "react";
import { View } from "react-native";

import { abs } from "./shared";

// Buddy Studio · viseira de corrida: faixa branca na testa e aba laranja
export const Viseira: React.FC = () => (
	<>
		<View
			style={abs({
				left: 2,
				top: 3,
				width: 84,
				height: 10,
				borderRadius: 5,
				backgroundColor: "#F4F6F8",
				boxShadow: "0 3px 5px -2px rgba(0,0,0,.35), inset 0 -2px 0 rgba(160,175,190,.6)",
			})}
		/>
		<View
			style={abs({
				left: 42,
				top: 6,
				width: 58,
				height: 12,
				borderRadius: 29,
				backgroundColor: "rgba(253,90,12,.92)",
				transform: [{ rotate: "-6deg" }],
				boxShadow: "0 4px 6px -2px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.4)",
			})}
		/>
	</>
);
