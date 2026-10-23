// Curvas da animação "órbita" (OrbitIntro.jsx), como worklets do Reanimated.

export const lerp = (a: number, b: number, t: number): number => {
	"worklet";
	return a + (b - a) * t;
};

export const clamp01 = (t: number): number => {
	"worklet";
	return Math.max(0, Math.min(1, t));
};

export const easeOutCubic = (t: number): number => {
	"worklet";
	return 1 - Math.pow(1 - t, 3);
};

export const easeInCubic = (t: number): number => {
	"worklet";
	return t * t * t;
};

export const easeBack = (t: number): number => {
	"worklet";
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
