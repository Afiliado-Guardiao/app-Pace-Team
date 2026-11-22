import React from "react";
import { View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyDots, IBuddyPose } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { useBudArrival } from "../../hooks/useBudArrival";
import { BuddyBubble } from "../BuddyBubble";

interface IBudSaysProps {
	text: string;
}

// Bud do tamanho da referência (maior que o da página do nome)
const SCALE = 112 / BUDDY_W;
// Espaço até a arte embaixo, como na referência
const GAP_BELOW = 64;
const WAVE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
const NO_ACCESSORIES = [] as const;

const createBudSaysStyles = (theme: ITheme) => ({
	root: {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: theme.pace.spacing[1],
		marginLeft: -theme.pace.spacing[3],
		marginBottom: GAP_BELOW,
	},
	buddy: { width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
	bubble: { flex: 1 },
});

// O Bud no canto de cima (chegou voando do Começar: bolinhas "pensando" e
// depois o Bud) com o balão que digita a frase
export const BudSays: React.FC<IBudSaysProps> = ({ text }) => {
	const { theme } = useTheme();
	const styles = createBudSaysStyles(theme);
	const arrival = useBudArrival();

	return (
		<View style={styles.root}>
			<View style={styles.buddy} pointerEvents="none">
				<BuddyDots
					mode={arrival}
					pose={WAVE}
					scale={SCALE}
					accessories={NO_ACCESSORIES}
					label={C.thinking}
				/>
			</View>
			<View style={styles.bubble}>
				{arrival === "bud" ? <BuddyBubble text={text} tail="left" isWide /> : null}
			</View>
		</View>
	);
};
