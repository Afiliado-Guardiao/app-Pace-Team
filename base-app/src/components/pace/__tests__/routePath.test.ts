import { routePath } from "../layout/MiniRoute/routePath";

describe("miniatura do percurso real", () => {
	it("precisa de pelo menos 2 pontos", () => {
		expect(routePath([[-23.5, -46.6]])).toBeNull();
	});

	it("desenha o caminho dentro da caixa, com o norte para cima", () => {
		const path = routePath([
			[-23.5, -46.6],
			[-23.49, -46.6],
		]);
		expect(path?.d.startsWith("M")).toBe(true);
		// Indo para o norte, o fim fica acima do início
		expect(path && path.end[1] < path.start[1]).toBe(true);
		for (const v of [...(path?.start ?? []), ...(path?.end ?? [])]) {
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThanOrEqual(64);
		}
	});
});
