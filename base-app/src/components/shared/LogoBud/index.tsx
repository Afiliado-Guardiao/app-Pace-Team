import React from "react";
import { View, ViewStyle } from "react-native";

import { BUDDY_H, BUDDY_W, MiniBuddy } from "@/components/buddy";
import { IShareLook } from "@/lib/buddy";

interface ILogoBudProps {
	look: IShareLook | null;
	// Largura do quadro do Bud (o corpo ocupa ~63% dela)
	width: number;
	// Centro horizontal e o topo do quadro (os acessórios de cabeça sobem
	// um pouco acima dele)
	centerX: number;
	top: number;
}

// Bud pequeno com o visual do Buddy Studio, no topo e no centro do story e
// do post compartilhados (só de quem usa acessório pago do Studio)
export const LogoBud: React.FC<ILogoBudProps> = ({ look, width, centerX, top }) => {
	if (!look) return null;
	const scale = width / BUDDY_W;
	const style: ViewStyle = {
		position: "absolute",
		left: centerX - width / 2,
		top,
		width,
		height: BUDDY_H * scale,
	};
	return (
		<View style={style} pointerEvents="none" testID="logo-bud">
			<MiniBuddy color={look.color} accessories={look.accessories} scale={scale} />
		</View>
	);
};
