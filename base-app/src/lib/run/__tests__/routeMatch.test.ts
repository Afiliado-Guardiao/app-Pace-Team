import { compareWithPrevious, IRouteRun, isSameRoute } from "../routeMatch";

// Reta para o norte saindo de (lat0, lng0): n pontos a cada ~11 m
const line = (lat0: number, lng0: number, n: number): [number, number][] =>
	Array.from({ length: n }, (_, i) => [lat0 + i * 0.0001, lng0] as [number, number]);

const run = (id: string, day: number, seconds: number, route: [number, number][]): IRouteRun => ({
	id,
	startedAt: `2026-10-${String(day).padStart(2, "0")}T12:00:00Z`,
	seconds,
	km: (route.length - 1) * 0.0111,
	route,
});

describe("percurso repetido", () => {
	const ida = line(-23.72, -46.53, 60);

	it("reconhece o mesmo caminho com o GPS um pouco diferente", () => {
		const outra = ida.map(([lat, lng]) => [lat + 0.0001, lng + 0.0001] as [number, number]);
		expect(isSameRoute(run("a", 27, 900, ida), run("b", 28, 880, outra))).toBe(true);
	});

	it("o caminho de volta (sentido contrário) é outro percurso", () => {
		expect(isSameRoute(run("a", 27, 900, ida), run("b", 28, 900, [...ida].reverse()))).toBe(false);
	});

	it("compara com a vez anterior: mais rápido e mais lento", () => {
		const antes = run("a", 27, 900, ida);
		const rapido = compareWithPrevious(run("b", 28, 840, ida), [antes]);
		expect(rapido?.isFaster).toBe(true);
		expect(rapido?.deltaSeconds).toBe(-60);
		const lento = compareWithPrevious(run("c", 29, 960, ida), [antes]);
		expect(lento?.isFaster).toBe(false);
		expect(lento?.deltaSeconds).toBe(60);
	});

	it("primeira vez no percurso: sem comparação", () => {
		expect(compareWithPrevious(run("a", 27, 900, ida), [])).toBeNull();
	});
});
