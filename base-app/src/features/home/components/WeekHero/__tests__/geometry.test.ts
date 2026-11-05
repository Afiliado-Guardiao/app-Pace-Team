import { PATH_SAMPLES, pointAt, TRACK_PATH } from "../scene/geometry";

describe("pista do Início", () => {
	it("tem pontos igualmente espaçados (velocidade constante)", () => {
		const steps = [];
		for (let i = 0; i < PATH_SAMPLES; i++) {
			const j = (i + 1) % PATH_SAMPLES;
			steps.push(
				Math.hypot(TRACK_PATH.xs[j] - TRACK_PATH.xs[i], TRACK_PATH.ys[j] - TRACK_PATH.ys[i]),
			);
		}
		const avg = steps.reduce((a, b) => a + b, 0) / steps.length;
		for (const s of steps) expect(Math.abs(s - avg)).toBeLessThan(avg * 0.15);
	});

	it("dá a volta inteira (u e u + 1 são o mesmo ponto)", () => {
		const a = pointAt(TRACK_PATH, 0.3);
		const b = pointAt(TRACK_PATH, 1.3);
		const c = pointAt(TRACK_PATH, -0.7);
		expect(b.x).toBeCloseTo(a.x, 5);
		expect(c.y).toBeCloseTo(a.y, 5);
	});
});
