// PACE TEAM — movimento (tokens/spacing.css + guidelines/motion).
// Curvas guardadas como pontos de controle cubic-bezier, convertidas com
// Easing.bezier(...) do Reanimated onde forem usadas.

export type IBezier = readonly [number, number, number, number];

export const paceMotion = {
	durations: {
		fast: 140,
		base: 240,
		slow: 480,
		rise: 600,
		pop: 600,
		grow: 900,
		countUp: 1100,
		gauge: 1300,
		progress: 1300,
		rail: 420,
	},

	easings: {
		out: [0.22, 1, 0.36, 1] as IBezier,
		inOut: [0.65, 0, 0.35, 1] as IBezier,
		spring: [0.34, 1.56, 0.64, 1] as IBezier,
		rail: [0.34, 1.45, 0.64, 1] as IBezier,
	},

	// Escala ao pressionar
	press: {
		button: 0.97,
		iconButton: 0.94,
		card: 0.985,
	},

	// Atrasos de entrada (stagger de 70ms entre linhas/blocos)
	stagger: 70,
	staggerMax: 10,
	progressDelay: 80,
	gaugeDelay: 120,

	// Distância da subida de entrada (pt-rise)
	riseOffset: 14,
	// Arrasto no trilho lateral: px por aba
	railDragStep: 30,
} as const;

export type IPaceMotion = typeof paceMotion;
