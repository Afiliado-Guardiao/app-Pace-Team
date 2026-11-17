import React from "react";
import { View, ViewStyle } from "react-native";

import { Logo } from "@/components/pace";
import { toShareLook } from "@/lib/buddy";

import { LogoBud } from "../LogoBud";

interface IPostLogoProps {
	cqw: number;
	// Altura da arte (px): o Bud fica a 3,5% do topo
	boxHeight: number;
	// Visual do Bud guardado no post (layers.bud); sem ele, só o logo
	bud: unknown;
	logoStyle: ViewStyle;
}

const LOGO_WIDTH = 34;
const LOGO_RATIO = 1659 / 215;
// Bud do Buddy Studio no topo, centralizado (largura em % da arte)
const BUD_W = 11;
const BUD_TOP = 0.035;

// Logo PACE TEAM no rodapé do post e, por cima de tudo no topo, o Bud de quem
// postou (só se ele usa acessório pago do Buddy Studio)
export const PostLogo: React.FC<IPostLogoProps> = ({ cqw, boxHeight, bud, logoStyle }) => (
	<>
		<View style={logoStyle} pointerEvents="none">
			<Logo variant="horizontal" height={(LOGO_WIDTH * cqw) / LOGO_RATIO} />
		</View>
		<LogoBud
			look={toShareLook(bud)}
			width={BUD_W * cqw}
			centerX={50 * cqw}
			top={boxHeight * BUD_TOP}
		/>
	</>
);
