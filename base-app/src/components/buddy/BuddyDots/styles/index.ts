import { ViewStyle } from "react-native";

import { EASE_IN, EASE_SPRING } from "../../animations";
import { BUDDY_H, BUDDY_W } from "../../BuddyFigure";

// O Bud derrete numa gotinha no meio do corpo; a gotinha se divide em
// quatro bolinhas que se espalham e ficam "pensando". Na volta, as bolinhas
// se juntam na gotinha e o Bud brota dela com uma molinha.
export const DOT_COUNT = 4;
const DOT = 12;
const GAP = 18;
// Altura do meio do corpo no quadro do Bud (onde a gotinha fica)
const MID = 70;
// Bolinhas grudadas formando a gotinha (antes de se separar)
const CLUSTER = 0.42;
const CLUSTER_SCALE = 1.9;
const CREAM = "#F2EADF";
// Quando a gotinha termina de se formar (s)
const MELT = 0.3;
// Começo da onda "pensando", depois que as bolinhas se espalharam (s)
export const THINK_DELAY = 0.85;
export const THINK_STEP = 0.14;

const sec = (n: number): string => `${n.toFixed(2)}s`;

export const dotStyle = (i: number, isDots: boolean, s: number): ViewStyle => {
	const off = i - (DOT_COUNT - 1) / 2;
	return {
		position: "absolute",
		left: (BUDDY_W * s) / 2 - (DOT * s) / 2,
		top: MID * s - (DOT * s) / 2,
		width: DOT * s,
		height: DOT * s,
		opacity: isDots ? 1 : 0,
		transform: [
			{ translateX: off * GAP * s * (isDots ? 1 : CLUSTER) },
			{ scale: isDots ? 1 : CLUSTER_SCALE },
		],
		transitionProperty: ["opacity", "transform"],
		// Ida: aparecem já grudadas (mesma cor da gotinha) e se espalham.
		// Volta: se juntam primeiro e só então somem dentro do Bud.
		transitionDuration: isDots ? ["0.06s", "0.5s"] : ["0.12s", "0.28s"],
		transitionDelay: isDots
			? [sec(MELT - 0.08), sec(MELT + Math.abs(off) * 0.05)]
			: ["0.26s", "0s"],
		transitionTimingFunction: isDots ? EASE_SPRING : EASE_IN,
	} as ViewStyle;
};

export const createBuddyDotsStyles = (s: number, isDots: boolean) => ({
	root: { width: BUDDY_W * s, height: BUDDY_H * s } as ViewStyle,
	bud: {
		position: "absolute",
		left: 0,
		top: 0,
		width: BUDDY_W,
		height: BUDDY_H,
		transformOrigin: "0% 0%",
		transform: [{ scale: s }],
	} as ViewStyle,
	// O corpo derrete para o meio (achata e estreita) até virar a gotinha
	melt: {
		width: BUDDY_W,
		height: BUDDY_H,
		transformOrigin: `50% ${String(Math.round((MID / BUDDY_H) * 100))}%`,
		opacity: isDots ? 0 : 1,
		transform: [{ scaleX: isDots ? 0.42 : 1 }, { scaleY: isDots ? 0.12 : 1 }],
		transitionProperty: ["opacity", "transform"],
		transitionDuration: isDots ? ["0.1s", sec(MELT + 0.04)] : ["0.08s", "0.55s"],
		transitionDelay: isDots ? [sec(MELT), "0s"] : ["0.22s", "0.24s"],
		transitionTimingFunction: isDots ? EASE_IN : EASE_SPRING,
	} as ViewStyle,
	ball: {
		width: "100%",
		height: "100%",
		borderRadius: (DOT * s) / 2,
		backgroundColor: CREAM,
		boxShadow: "0 2px 4px rgba(0,0,0,.35)",
	} as ViewStyle,
});
