// Animações do Pace Buddy: os @keyframes do design traduzidos para as
// animações CSS do Reanimated 4 (mesmos tempos e curvas). O desfoque
// (filter: blur) das entradas/saídas não existe no iPhone e ficou de fora.
import {
	CSSAnimationKeyframes,
	CSSAnimationProperties,
	cubicBezier,
} from "react-native-reanimated";

export const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_SPRING = cubicBezier(0.34, 1.56, 0.64, 1);
export const EASE_DASH = cubicBezier(0.55, 0, 0.8, 0.2);

type IFrame = Record<string, unknown>;
type IKeyframes = Record<string, IFrame>;

const t = (x: number, y: number, sx = 1, sy = 1, rot = "0deg") => [
	{ translateX: x },
	{ translateY: y },
	{ scaleX: sx },
	{ scaleY: sy },
	{ rotate: rot },
];

export const KF: Record<string, IKeyframes> = {
	float: {
		"0%": { transform: t(0, 0) },
		"50%": { transform: t(0, -4) },
		"100%": { transform: t(0, 0) },
	},
	pop: {
		"0%": { opacity: 0, transform: t(0, -62, 0.12, 0.12) },
		"55%": { opacity: 1, transform: t(0, 6, 1.07, 0.95) },
		"78%": { opacity: 1, transform: t(0, -2, 0.98, 1.02) },
		"100%": { opacity: 1, transform: t(0, 0) },
	},
	out: {
		"0%": { opacity: 1, transform: t(0, 0) },
		"25%": { opacity: 1, transform: t(0, 4, 1.05, 0.94) },
		"100%": { opacity: 0, transform: t(0, -70, 0.1, 0.1) },
	},
	dash: {
		"0%": { opacity: 1, transform: t(0, 0) },
		"35%": { opacity: 1, transform: t(-6, 4, 1.06, 0.92) },
		"100%": { opacity: 0, transform: t(0, -96, 0.06, 0.5) },
	},
	jump: {
		"0%": { transform: t(0, 0) },
		"12%": { transform: t(0, 2, 1.08, 0.9) },
		"45%": { transform: t(0, -20, 0.96, 1.05) },
		"70%": { transform: t(0, 0, 1.05, 0.94) },
		"100%": { transform: t(0, 0) },
	},
	hop: {
		"0%": { transform: t(0, 0) },
		"40%": { transform: t(0, -10) },
		"70%": { transform: t(0, 1, 1.04, 0.96) },
		"100%": { transform: t(0, 0) },
	},
	buzz: {
		"0%": { transform: t(0, 0) },
		"25%": { transform: t(-2, 0, 1, 1, "-2.5deg") },
		"50%": { transform: t(0, -1) },
		"75%": { transform: t(2, 0, 1, 1, "2.5deg") },
		"100%": { transform: t(0, 0) },
	},
	breathe: {
		"0%": { transform: t(0, 0) },
		"50%": { transform: t(0, 2, 1.03, 0.95) },
		"100%": { transform: t(0, 0) },
	},
	bob: {
		"0%": { transform: t(0, 0) },
		"50%": { transform: t(0, -3) },
		"100%": { transform: t(0, 0) },
	},
	wave: {
		"0%": { transform: [{ rotate: "-24deg" }] },
		"100%": { transform: [{ rotate: "24deg" }] },
	},
	pump: {
		"0%": { transform: [{ translateY: 0 }] },
		"50%": { transform: [{ translateY: -6 }] },
		"100%": { transform: [{ translateY: 0 }] },
	},
	spin: {
		"0%": { transform: [{ rotate: "0deg" }] },
		"100%": { transform: [{ rotate: "360deg" }] },
	},
	spinr: {
		"0%": { transform: [{ rotate: "0deg" }] },
		"100%": { transform: [{ rotate: "-360deg" }] },
	},
	ringin: {
		"0%": { opacity: 0, transform: [{ scale: 0.2 }] },
		"70%": { opacity: 1, transform: [{ scale: 1.12 }] },
		"100%": { opacity: 1, transform: [{ scale: 1 }] },
	},
	streak: {
		"0%": { opacity: 0, transform: [{ translateX: 30 }, { scaleX: 0.4 }] },
		"30%": { opacity: 1, transform: [{ translateX: 8.5 }, { scaleX: 0.58 }] },
		"100%": { opacity: 0, transform: [{ translateX: -40 }, { scaleX: 1 }] },
	},
	ray: {
		"0%": { opacity: 0.35, transform: [{ scaleY: 0.6 }] },
		"100%": { opacity: 1, transform: [{ scaleY: 1.15 }] },
	},
	arc: {
		"0%": { opacity: 0.25, transform: [{ scale: 0.9 }] },
		"100%": { opacity: 1, transform: [{ scale: 1.08 }] },
	},
	z: {
		"0%": { opacity: 0, transform: [{ translateX: 0 }, { translateY: 10 }, { scale: 0.6 }] },
		"20%": { opacity: 1, transform: [{ translateX: 3.6 }, { translateY: 3.2 }, { scale: 0.71 }] },
		"100%": { opacity: 0, transform: [{ translateX: 18 }, { translateY: -24 }, { scale: 1.15 }] },
	},
	q: {
		"0%": { transform: [{ translateY: 0 }, { rotate: "-6deg" }] },
		"50%": { transform: [{ translateY: -5 }, { rotate: "8deg" }] },
		"100%": { transform: [{ translateY: 0 }, { rotate: "-6deg" }] },
	},
	spark: {
		"0%": { opacity: 0, transform: [{ scale: 0.2 }, { rotate: "0deg" }] },
		"50%": { opacity: 1, transform: [{ scale: 1 }, { rotate: "45deg" }] },
		"100%": { opacity: 0, transform: [{ scale: 0.2 }, { rotate: "0deg" }] },
	},
	halo: {
		"0%": { transform: [{ translateY: 0 }] },
		"50%": { transform: [{ translateY: -3 }] },
		"100%": { transform: [{ translateY: 0 }] },
	},
	sheen: { "0%": { left: -40 }, "38%": { left: 120 }, "100%": { left: 120 } },
	aura: {
		"0%": { opacity: 0.55, transform: [{ scale: 0.94 }] },
		"50%": { opacity: 1, transform: [{ scale: 1.06 }] },
		"100%": { opacity: 0.55, transform: [{ scale: 0.94 }] },
	},
	cape: {
		"0%": { transform: [{ skewX: "0deg" }, { scaleY: 1 }] },
		"50%": { transform: [{ skewX: "-5deg" }, { scaleY: 1.05 }] },
		"100%": { transform: [{ skewX: "0deg" }, { scaleY: 1 }] },
	},
	drop: {
		"0%": { opacity: 0, transform: [{ translateY: -46 }, { scale: 1.3 }] },
		"60%": { opacity: 1, transform: [{ translateY: 3 }, { scale: 0.96 }] },
		"100%": { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
	},
	shiver: {
		"0%": { transform: [{ translateX: 0 }, { translateY: 0 }] },
		"6%": { transform: [{ translateX: -1.5 }, { translateY: 1 }] },
		"9%": { transform: [{ translateX: 1.5 }, { translateY: 1 }] },
		"12%": { transform: [{ translateX: -1.5 }, { translateY: 1 }] },
		"15%": { transform: [{ translateX: 1 }, { translateY: 1 }] },
		"18%": { transform: [{ translateX: 0 }, { translateY: 1 }] },
		"55%": { transform: [{ translateX: 0 }, { translateY: 3 }] },
		"100%": { transform: [{ translateX: 0 }, { translateY: 0 }] },
	},
	flush: { "0%": { opacity: 0.7 }, "50%": { opacity: 1 }, "100%": { opacity: 0.7 } },
	sweat: {
		"0%": { opacity: 0, transform: [{ translateY: 0 }, { scale: 0.6 }] },
		"20%": { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
		"100%": { opacity: 0, transform: [{ translateY: 16 }, { scale: 0.9 }] },
	},
	tmBob: {
		"0%": { transform: [{ translateY: 0 }] },
		"50%": { transform: [{ translateY: -1.5 }] },
		"100%": { transform: [{ translateY: 0 }] },
	},
	tmUp: {
		"0%": { opacity: 1, transform: t(0, 0) },
		"30%": { opacity: 1, transform: t(0, 2, 1.12, 0.88) },
		"100%": { opacity: 0, transform: t(0, -84, 0.3, 0.6) },
	},
	tmIn: {
		"0%": { opacity: 0, transform: [{ scale: 0.3 }] },
		"70%": { opacity: 1, transform: [{ scale: 1.15 }] },
		"100%": { opacity: 1, transform: [{ scale: 1 }] },
	},
	panelIn: {
		"0%": { opacity: 0, transform: [{ translateY: -14 }, { scale: 0.94 }] },
		"100%": { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
	},
	glow: {
		"0%": { boxShadow: "0 0 0 0 rgba(253,90,12,0)" },
		"40%": { boxShadow: "0 0 24px 5px rgba(253,90,12,.6)" },
		"100%": { boxShadow: "0 0 0 0 rgba(253,90,12,0)" },
	},
	// Ilha da corrida abrindo (124 → 240 px, como a Dynamic Island do design)
	island: { "0%": { width: 124 }, "100%": { width: 240 } },
	leg: {
		"0%": { transform: [{ rotate: "-38deg" }] },
		"50%": { transform: [{ rotate: "38deg" }] },
		"100%": { transform: [{ rotate: "-38deg" }] },
	},
};

// Monta o estilo de animação (equivalente ao "animation:" do CSS)
export const anim = (
	name: keyof typeof KF,
	duration: string,
	options: {
		timing?: ReturnType<typeof cubicBezier> | "linear" | "ease-in-out" | "ease-out" | "ease-in";
		delay?: string;
		count?: number | "infinite";
		direction?: "normal" | "alternate";
		fill?: "none" | "both" | "forwards";
	} = {},
): Partial<CSSAnimationProperties> =>
	({
		animationName: KF[name] as unknown as CSSAnimationKeyframes,
		animationDuration: duration,
		animationTimingFunction: options.timing ?? "ease-in-out",
		animationDelay: options.delay ?? "0s",
		animationIterationCount: options.count ?? "infinite",
		animationDirection: options.direction ?? "normal",
		animationFillMode: options.fill ?? "none",
	}) as unknown as Partial<CSSAnimationProperties>;
