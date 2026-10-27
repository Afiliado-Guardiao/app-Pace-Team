jest.mock("@/lib/data", () => ({ useMyRuns: () => ({ saved: [] }) }));

import { vitalsOf } from "../useBuddyMood";

const NOW = new Date(2026, 9, 26, 20, 0).getTime();
const daysAgo = (days: number): number => new Date(2026, 9, 26 - days, 7, 0).getTime();

describe("vida do Buddy", () => {
	it("começa cheia para quem ainda não correu", () => {
		expect(vitalsOf(null, NOW)).toEqual({ mood: "normal", life: 1 });
	});

	it("fica cheia e comemora no dia em que corre", () => {
		expect(vitalsOf(daysAgo(0), NOW)).toEqual({ mood: "celebrate", life: 1 });
	});

	it("perde um pedaço por dia sem correr", () => {
		expect(vitalsOf(daysAgo(1), NOW).life).toBeCloseTo(6 / 7);
		expect(vitalsOf(daysAgo(5), NOW)).toEqual({ mood: "normal", life: 2 / 7 });
	});

	it("fica doente com 7 dias sem correr", () => {
		expect(vitalsOf(daysAgo(7), NOW)).toEqual({ mood: "sick", life: 0 });
		expect(vitalsOf(daysAgo(12), NOW)).toEqual({ mood: "sick", life: 0 });
	});
});
