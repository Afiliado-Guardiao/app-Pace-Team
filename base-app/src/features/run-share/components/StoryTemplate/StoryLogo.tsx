import React from "react";

import { Logo } from "@/components/pace";

interface IStoryLogoProps {
	x: number;
	y: number;
	width: number;
}

const RATIO = 216 / 696;

// Logo PACE TEAM branco no rodapé do story.
export const StoryLogo: React.FC<IStoryLogoProps> = ({ x, y, width }) => (
	<Logo
		variant="white"
		height={width * RATIO}
		style={{ position: "absolute", left: x, top: y, width }}
	/>
);
