import { fitCrewLines, layoutCrewPins, pinAnchors } from "../crewArt";
import { buildRunCrew } from "../runCrew";
import { ICrewRunner } from "../useRunCrew";

const PATH: [number, number][] = [
	[-23.6, -46.6],
	[-23.601, -46.601],
	[-23.602, -46.602],
];

const runner = (over: Partial<ICrewRunner>): ICrewRunner => ({
	userId: "u",
	name: "Atleta",
	photo: null,
	isOwner: false,
	isYou: false,
	isLive: false,
	km: 0,
	seconds: 0,
	shape: [],
	...over,
});

describe("buildRunCrew", () => {
	it("sozinho: o próprio percurso com a sua foto redonda na chegada", () => {
		const crew = buildRunCrew({ name: "Wesley", photo: "w.jpg", route: PATH }, []);
		expect(crew.route).toBe(PATH);
		expect(crew.lines).toEqual([{ points: PATH, isOwner: true }]);
		expect(crew.crew).toEqual([{ image: { uri: "w.jpg" }, name: "Wesley", line: 0, at: 1 }]);
	});

	it("sozinho e sem foto de perfil: só o percurso", () => {
		const crew = buildRunCrew({ name: "Wesley", photo: null, route: PATH }, []);
		expect(crew.crew).toEqual([]);
	});

	it("em grupo: o percurso de cada um e a foto de todos, mesmo de quem andou pouco", () => {
		const crew = buildRunCrew({ name: "Wesley", photo: "w.jpg", route: [] }, [
			runner({
				name: "Wesley",
				photo: "w.jpg",
				isOwner: true,
				km: 0.006,
				seconds: 109,
				shape: [
					[0, 0],
					[0.00004, 0.00005],
				],
			}),
			runner({ name: "Matheus Dutra", photo: "m.jpg", km: 0.105, seconds: 128, shape: PATH }),
		]);
		expect(crew.lines).toHaveLength(2);
		expect(crew.lines[0]?.isOwner).toBe(true);
		expect(crew.lines[1]?.points).toBe(PATH);
		expect(crew.crew.map((p) => p.label)).toEqual([
			"Wesley · 6 m · 302'47\"",
			"Matheus · 105 m · 20'19\"",
		]);
		expect(crew.crew.map((p) => p.line)).toEqual([0, 1]);
	});

	it("em grupo: quem não tem GPS aparece mesmo assim (na largada)", () => {
		const crew = buildRunCrew({ name: "Wesley", photo: null, route: [] }, [
			runner({ name: "Wesley", isOwner: true, km: 0 }),
			runner({ name: "Dutra", photo: "m.jpg", km: 1.2, seconds: 600, shape: PATH }),
		]);
		expect(crew.crew).toHaveLength(2);
		expect(crew.crew[0]?.line).toBe(-1);
		expect(crew.crew[0]?.label).toBe("Wesley · 0 m");
	});

	it("colega ainda correndo: aparece com 'correndo'", () => {
		const crew = buildRunCrew({ name: "Wesley", photo: null, route: PATH }, [
			runner({ name: "Wesley", isOwner: true, km: 0.5, seconds: 200, shape: PATH }),
			runner({ name: "Dutra", isLive: true, km: 0.01, seconds: 100, shape: PATH }),
		]);
		expect(crew.crew[1]?.label).toBe("Dutra · 10 m · correndo");
	});
});

describe("desenho da corrida em grupo", () => {
	const BOX = { x: 0, y: 0, w: 100, h: 100 };

	it("encaixa todos os percursos na mesma escala, dentro do quadro", () => {
		const fitted = fitCrewLines([PATH, [[-23.6, -46.6]]], BOX);
		for (const [x, y] of fitted.flat()) {
			expect(x).toBeGreaterThanOrEqual(-0.001);
			expect(x).toBeLessThanOrEqual(100.001);
			expect(y).toBeGreaterThanOrEqual(-0.001);
			expect(y).toBeLessThanOrEqual(100.001);
		}
		// O ponto parado está no começo do percurso do colega
		expect(fitted[1]?.[0]).toEqual(fitted[0]?.[0]);
	});

	it("foto no fim do percurso de cada um; sem percurso, na largada", () => {
		const fitted = fitCrewLines([PATH, []], BOX);
		const anchors = pinAnchors(fitted, [0, 1], BOX);
		expect(anchors[0]).toEqual(fitted[0]?.at(-1));
		expect(anchors[1]).toEqual(fitted[0]?.[0]);
	});

	it("duas fotos no mesmo lugar não se cobrem (nem os nomes)", () => {
		const metrics = { pinW: 20, pinH: 25, labelW: 60, labelH: 8, gap: 2 };
		const placed = layoutCrewPins(
			[
				[50, 50],
				[50, 50],
				[51, 50],
			],
			{ metrics, hasLabel: [true, true, true] },
		);
		const boxes = placed.map((p) => {
			const labelY = p.labelAbove
				? p.y - metrics.pinH - metrics.gap - metrics.labelH
				: p.y + metrics.gap;
			return [
				{ x: p.x - 10, y: p.y - 25, w: 20, h: 25 },
				{ x: p.x - 30, y: labelY, w: 60, h: 8 },
			];
		});
		for (let i = 0; i < boxes.length; i++) {
			for (let j = i + 1; j < boxes.length; j++) {
				for (const a of boxes[i] ?? []) {
					for (const b of boxes[j] ?? []) {
						const hit = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
						expect(hit).toBe(false);
					}
				}
			}
		}
	});
});
