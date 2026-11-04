import { fromStoredCrew, routeShape, toStoredCrew } from "../postArt";

describe("desenho do post", () => {
	it("tira o GPS: começa em [0, 0] e mantém o formato", () => {
		const shape = routeShape([
			[-23.55, -46.63],
			[-23.551, -46.63],
			[-23.551, -46.629],
		]);
		expect(shape[0]).toEqual([0, 0]);
		expect(shape[1]?.[0]).toBeCloseTo(-0.001, 6);
		// x corrigido pela latitude (cos −23,55° ≈ 0,9167)
		expect(shape[2]?.[1]).toBeCloseTo(0.000917, 6);
		expect(shape.every(([lat, lng]) => Math.abs(lat) < 1 && Math.abs(lng) < 1)).toBe(true);
	});

	it("percurso longo fica com no máximo 500 pontos e termina na chegada", () => {
		const route = Array.from({ length: 2000 }, (_, i) => [-23.5 + i * 1e-5, -46.6] as const);
		const shape = routeShape(route);
		expect(shape.length).toBeLessThanOrEqual(501);
		expect(shape.at(-1)?.[0]).toBeCloseTo(1999 * 1e-5, 6);
	});

	it("guarda e recupera as fotos de quem correu junto", () => {
		const crew = [
			{ image: { uri: "w.jpg" }, name: "Wesley", label: "Wesley · 1 km · 5'00\"", at: 1 },
			{ image: undefined, name: "Matheus", at: 0 },
		];
		const stored = toStoredCrew(crew);
		expect(stored).toEqual([
			{ photo: "w.jpg", name: "Wesley", label: "Wesley · 1 km · 5'00\"", at: 1 },
			{ photo: null, name: "Matheus", at: 0 },
		]);
		expect(fromStoredCrew(stored)[0]?.image).toEqual({ uri: "w.jpg" });
	});
});
