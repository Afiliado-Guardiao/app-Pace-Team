import { syncStart, toWatchRun } from "../convert";
import { IHealthWorkout } from "../types";

const workout = (over: Partial<IHealthWorkout> = {}): IHealthWorkout => ({
	uuid: "abc",
	startDate: new Date("2026-11-17T09:00:00Z"),
	endDate: new Date("2026-11-17T09:40:00Z"),
	durationSeconds: 2400,
	distance: { quantity: 8200, unit: "m" },
	avgHr: 152.4,
	sourceName: "Apple Watch de Ana",
	route: [
		{ latitude: -23.5, longitude: -46.6 },
		{ latitude: -23.51, longitude: -46.61 },
	],
	...over,
});

describe("corrida do relógio (app Saúde)", () => {
	it("vira corrida do PACE TEAM", () => {
		expect(toWatchRun(workout())).toEqual({
			externalId: "abc",
			startedAt: Date.parse("2026-11-17T09:00:00Z"),
			finishedAt: Date.parse("2026-11-17T09:40:00Z"),
			seconds: 2400,
			km: 8.2,
			route: [
				[-23.5, -46.6],
				[-23.51, -46.61],
			],
			avgHr: 152,
			deviceName: "Apple Watch de Ana",
		});
	});

	it("entende km e milhas, e sem distância fica de fora", () => {
		expect(toWatchRun(workout({ distance: { quantity: 5, unit: "km" } }))?.km).toBe(5);
		expect(toWatchRun(workout({ distance: { quantity: 1, unit: "mi" } }))?.km).toBeCloseTo(
			1.609,
			3,
		);
		expect(toWatchRun(workout({ distance: null }))).toBeNull();
	});

	it("sem mapa e sem batimentos também entra (Garmin)", () => {
		const run = toWatchRun(workout({ route: [], avgHr: null }));
		expect(run?.route).toEqual([]);
		expect(run?.avgHr).toBeNull();
	});

	it("busca só a partir do dia em que conectou", () => {
		const connected = new Date(2026, 10, 17, 15, 30).getTime();
		expect(syncStart(connected, null)).toEqual(new Date(2026, 10, 17, 0, 0));
		const later = new Date(2026, 10, 25, 8, 0).getTime();
		expect(syncStart(connected, later)).toEqual(new Date(2026, 10, 23, 8, 0));
	});
});
