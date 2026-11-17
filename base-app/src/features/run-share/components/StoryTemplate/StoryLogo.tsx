import React from "react";

import { Logo } from "@/components/pace";
import { LogoBud } from "@/components/shared/LogoBud";
import { toShareLook, useBuddyLook } from "@/lib/buddy";

import { STORY } from "../../constants";

interface IStoryLogoProps {
	x: number;
	y: number;
	width: number;
}

const RATIO = 215 / 1659;
// Bud do Buddy Studio no topo, centralizado, por cima de tudo
const BUD_W = 128;
const BUD_TOP = 60;

// Logo PACE TEAM branco no rodapé do story. Quem usa acessório pago do
// Buddy Studio ganha o Bud com esse visual no topo do story.
export const StoryLogo: React.FC<IStoryLogoProps> = ({ x, y, width }) => {
	const look = useBuddyLook();
	return (
		<>
			<Logo
				variant="white"
				height={width * RATIO}
				style={{ position: "absolute", left: x, top: y, width }}
			/>
			<LogoBud look={toShareLook(look)} width={BUD_W} centerX={STORY.width / 2} top={BUD_TOP} />
		</>
	);
};
