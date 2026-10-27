import { CSSAnimationKeyframes, CSSAnimationProperties } from "react-native-reanimated";

// Balança de tempos em tempos (como um aviso tocando) até o atleta escolher
const SHAKE: CSSAnimationKeyframes = {
	"0%": { transform: [{ rotate: "0deg" }] },
	"70%": { transform: [{ rotate: "0deg" }] },
	"74%": { transform: [{ rotate: "-2.2deg" }] },
	"78%": { transform: [{ rotate: "2.2deg" }] },
	"82%": { transform: [{ rotate: "-1.6deg" }] },
	"86%": { transform: [{ rotate: "1.2deg" }] },
	"90%": { transform: [{ rotate: "0deg" }] },
	"100%": { transform: [{ rotate: "0deg" }] },
};

export const SHAKE_ANIMATION: Partial<CSSAnimationProperties> = {
	animationName: SHAKE,
	animationDuration: "2.4s",
	animationIterationCount: "infinite",
	animationTimingFunction: "ease-in-out",
};
