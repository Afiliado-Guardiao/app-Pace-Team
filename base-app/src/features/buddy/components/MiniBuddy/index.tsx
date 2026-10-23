import React from "react";
import { View } from "react-native";

import { IBuddyAccessoryId, IBuddyColorId } from "@/lib/buddy/constants";

import { BUDDY_H, BUDDY_W, BuddyFigure } from "../BuddyFigure";

interface IMiniBuddyProps {
	color: IBuddyColorId;
	accessories: readonly IBuddyAccessoryId[];
	scale?: number;
	// Bloqueado: cinza e mais escuro
	isDim?: boolean;
}

const IDLE = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 } as const;
const DIM = [{ grayscale: 1 }, { brightness: 0.62 }] as const;

// Miniatura parada do Buddy (cores e acessórios da folha e da bandeja).
export const MiniBuddy: React.FC<IMiniBuddyProps> = ({
	color,
	accessories,
	scale = 0.44,
	isDim = false,
}) => (
	<View
		style={{
			width: BUDDY_W * scale,
			height: BUDDY_H * scale,
			filter: isDim ? [...DIM] : undefined,
		}}
		pointerEvents="none"
	>
		<View
			style={{
				position: "absolute",
				left: 0,
				top: 0,
				transform: [{ scale }],
				transformOrigin: "0% 0%",
			}}
		>
			<BuddyFigure pose={IDLE} color={color} accessories={accessories} isMini />
		</View>
	</View>
);
