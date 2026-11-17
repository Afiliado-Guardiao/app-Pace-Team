import React from "react";
import { View } from "react-native";

import { IBuddyAct } from "@/lib/buddy/constants";

import { isSleepAct } from "./pose";

interface IMouthProps {
	act: IBuddyAct;
	// Cor da boca (clara no Bud preto); padrão: preto
	ink?: string;
}

const INK = "#0B1520";

// Boca do Buddy: termômetro (doente), risquinho (sono) ou "O" (impressionado).
export const Mouth: React.FC<IMouthProps> = ({ act, ink = INK }) => {
	if (act === "sick") {
		return (
			<View
				style={{ position: "absolute", left: 0, top: 0, width: 88, height: 70, zIndex: 2 }}
				pointerEvents="none"
			>
				<View
					style={{
						position: "absolute",
						left: 39,
						top: 45,
						width: 9,
						height: 7,
						borderRadius: 5,
						backgroundColor: ink,
					}}
				/>
				<View
					style={{
						position: "absolute",
						left: 45,
						top: 47,
						width: 36,
						height: 6,
						borderRadius: 3,
						overflow: "hidden",
						backgroundColor: "#E9EEF3",
						boxShadow: "0 2px 3px rgba(0,0,0,.35), inset 0 0 0 0.8px rgba(0,0,0,.18)",
						transformOrigin: "0% 50%",
						transform: [{ rotate: "18deg" }],
					}}
				>
					<View
						style={{
							position: "absolute",
							left: 0,
							top: 2,
							width: 22,
							height: 2,
							borderRadius: 1,
							backgroundColor: "#E8322A",
						}}
					/>
				</View>
			</View>
		);
	}
	if (isSleepAct(act)) {
		return (
			<View
				style={{
					position: "absolute",
					left: 41,
					top: 46,
					width: 7,
					height: 2.5,
					borderRadius: 2,
					backgroundColor: ink,
					opacity: 0.8,
				}}
			/>
		);
	}
	// Com sede: boquinha triste (arco para baixo)
	if (act === "thirsty") {
		return (
			<View
				style={{
					position: "absolute",
					left: 38,
					top: 47,
					width: 12,
					height: 6,
					borderTopWidth: 2.4,
					borderLeftWidth: 0.6,
					borderRightWidth: 0.6,
					borderColor: ink,
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
					opacity: 0.85,
				}}
			/>
		);
	}
	if (act === "impressed") {
		return (
			<View
				style={{
					position: "absolute",
					left: 39,
					top: 45,
					width: 10,
					height: 12,
					borderRadius: 6,
					backgroundColor: ink,
					boxShadow: "inset 0 -3px 0 #3A1A10",
				}}
			/>
		);
	}
	return null;
};
