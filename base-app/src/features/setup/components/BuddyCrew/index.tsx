import React from "react";
import { Image, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";
import { CREW } from "@/lib/pace";

import { useWorn } from "../../hooks/useWorn";

const STAGE = { w: 250, h: 150 } as const;
const SCALE = 110 / BUDDY_W;
const IDLE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
// Quatro amigos em volta do Buddy (posição e tamanho de cada foto)
const SPOTS = [
	{ left: 18, top: 8, size: 46 },
	{ left: 186, top: 4, size: 50 },
	{ left: 36, top: 92, size: 40 },
	{ left: 196, top: 92, size: 42 },
] as const;

const createBuddyCrewStyles = (theme: ITheme) => ({
	stage: { alignSelf: "center" as const, width: STAGE.w, height: STAGE.h },
	buddy: {
		position: "absolute" as const,
		left: (STAGE.w - BUDDY_W * SCALE) / 2,
		top: (STAGE.h - BUDDY_H * SCALE) / 2,
		width: BUDDY_W * SCALE,
		height: BUDDY_H * SCALE,
	},
	buddyInner: {
		position: "absolute" as const,
		transform: [{ scale: SCALE }],
		transformOrigin: "0% 0%",
	},
	photo: {
		position: "absolute" as const,
		borderWidth: 2,
		borderColor: theme.pace.colors.avatarRing,
		boxShadow: theme.pace.shadows.card,
	},
});

// 05 · o Buddy cercado de amigos ("Sua equipe começa com você")
export const BuddyCrew: React.FC = () => {
	const { theme } = useTheme();
	const worn = useWorn();
	const styles = createBuddyCrewStyles(theme);

	return (
		<View style={styles.stage} pointerEvents="none">
			{SPOTS.map((s, i) => (
				<Image
					key={s.left}
					source={CREW[i]}
					style={[
						styles.photo,
						{ left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: s.size / 2 },
					]}
				/>
			))}
			<View style={styles.buddy}>
				<View style={styles.buddyInner}>
					<BuddyFigure pose={IDLE} color="branco" accessories={worn} />
				</View>
			</View>
		</View>
	);
};
