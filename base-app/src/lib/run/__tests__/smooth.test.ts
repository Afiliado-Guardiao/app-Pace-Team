import { distanceMeters, IRunPoint } from "../geo";
import { smoothPoint } from "../smooth";

const M = 1 / 111_320;
const at = (north: number, east: number, seconds: number, accuracy = 15): IRunPoint => ({
	lat: -23.5 + north * M,
	lng: -46.6 + east * M,
	t: seconds * 1000,
	accuracy,
});

describe("suavização do GPS", () => {
	it("anda em linha reta com o sinal oscilando ±20 m: tira o zigue-zague", () => {
		// Indo para o norte 1,4 m/s, o GPS pula 20 m para um lado e para o outro
		const raw = Array.from({ length: 30 }, (_, i) => at(i * 7, i % 2 ? 20 : -20, i * 5));
		let prev: IRunPoint | undefined;
		const smooth = raw.map((p) => {
			prev = smoothPoint(prev, p);
			return prev;
		});
		const sideways = (p: IRunPoint): number => Math.abs((p.lng + 46.6) / M);
		const maxRaw = Math.max(...raw.slice(5).map(sideways));
		const maxSmooth = Math.max(...smooth.slice(5).map(sideways));
		expect(maxRaw).toBeCloseTo(20, 0);
		expect(maxSmooth).toBeLessThan(10);
	});

	it("o primeiro ponto fica onde está", () => {
		const first = at(0, 0, 0);
		expect(smoothPoint(undefined, first)).toMatchObject({ lat: first.lat, lng: first.lng });
	});

	it("parado muito tempo e depois longe: alcança o lugar novo", () => {
		const a = smoothPoint(undefined, at(0, 0, 0, 5));
		const b = smoothPoint(a, at(100, 0, 120, 5));
		expect(distanceMeters(b, at(100, 0, 120))).toBeLessThan(6);
	});
});
