import { isThirstyNow } from "../day";
import {
	dailyBaseMl,
	dayTargetMl,
	duringAdvice,
	estimatedSweatRate,
	preRunMl,
	runHydration,
	sweatRateOf,
} from "../estimate";

const body = { weightKg: 70, heightCm: 175, age: 30 };
const run = { id: "r1", startedAt: "2026-11-16T10:00:00.000Z", seconds: 3600, km: 10 };

describe("PACE HYDRATION — estimativas", () => {
	it("base do dia pelo peso, presa entre 1,6 e 2,8 L", () => {
		expect(dailyBaseMl(body)).toBe(2100);
		expect(dailyBaseMl({ ...body, weightKg: 40 })).toBe(1600);
		expect(dailyBaseMl({ ...body, weightKg: 130 })).toBe(2800);
		// Sem peso: o meio da faixa da EFSA
		expect(dailyBaseMl({ ...body, weightKg: null })).toBe(2000);
	});

	it("taxa de suor pela pesagem e números que não fecham", () => {
		const test = { id: "t", at: 0, preKg: 70, postKg: 69, minutes: 60, fluidMl: 500 };
		expect(sweatRateOf(test)).toBeCloseTo(1.5);
		expect(sweatRateOf({ ...test, minutes: 5 })).toBeNull();
		expect(sweatRateOf({ ...test, postKg: 72, fluidMl: 0 })).toBeNull();
	});

	it("suor estimado fica na faixa do ACSM e sobe no calor", () => {
		const mild = estimatedSweatRate({ run, body, tempC: 20 });
		const hot = estimatedSweatRate({ run, body, tempC: 31 });
		expect(mild).toBeGreaterThanOrEqual(0.3);
		expect(hot).toBeGreaterThan(mild);
		expect(
			estimatedSweatRate({ run: { ...run, km: 30 }, body: { ...body, weightKg: 140 }, tempC: 40 }),
		).toBeLessThanOrEqual(2);
	});

	it("reposição depois da corrida com teto e meta do dia com teto", () => {
		const r = runHydration({ run: { ...run, seconds: 4 * 3600 }, body, tempC: 35, tests: [] });
		expect(r.replaceMl).toBeLessThanOrEqual(1500);
		expect(r.isPersonal).toBe(false);
		expect(dayTargetMl(2800, 5000)).toBe(4500);
	});

	it("antes e durante a corrida", () => {
		expect(preRunMl(body)).toEqual({ min: 350, max: 500 });
		expect(duringAdvice(30)).toBe("none");
		expect(duringAdvice(70)).toBe("sips");
		expect(duringAdvice(120)).toBe("plan");
	});

	it("Bud com sede só quando falta muito para o horário", () => {
		const at = (h: number) => new Date(2026, 10, 16, h).getTime();
		expect(isThirstyNow({ drankMl: 0, targetMl: 2000, now: at(8) })).toBe(false);
		expect(isThirstyNow({ drankMl: 300, targetMl: 2000, now: at(15) })).toBe(true);
		expect(isThirstyNow({ drankMl: 1200, targetMl: 2000, now: at(19) })).toBe(false);
	});
});
