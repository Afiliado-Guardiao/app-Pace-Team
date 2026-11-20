import { planHydrationReminders } from "../notifications";
import { DEFAULT_REMINDERS } from "../store";

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

describe("planHydrationReminders", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		// Uma segunda às 6h: todos os horários de hoje ainda vêm pela frente
		jest.setSystemTime(new Date(2026, 10, 23, 6, 0, 0));
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it("diz quanto falta beber hoje e a meta do dia nos dias seguintes", () => {
		const plan = planHydrationReminders(
			{ ...DEFAULT_REMINDERS, isOn: true, days: ALL_DAYS, startHour: 8, endHour: 10, everyMin: 60 },
			{ todayMl: 1500, dayMl: 2100 },
		);
		const today = plan.filter((p) => p.at.getDate() === 23);
		const tomorrow = plan.filter((p) => p.at.getDate() === 24);
		expect(today).toHaveLength(3);
		expect(today[0]?.body).toBe("Falta você beber 1,5 L de água hoje. Já bebeu?");
		expect(tomorrow[0]?.body).toBe("Falta você beber 2,1 L de água hoje. Já bebeu?");
		expect(today[0]?.at.getHours()).toBe(8);
	});

	it("não lembra hoje quando a meta já foi batida", () => {
		const plan = planHydrationReminders(
			{ ...DEFAULT_REMINDERS, isOn: true, days: ALL_DAYS, startHour: 8, endHour: 10, everyMin: 60 },
			{ todayMl: 0, dayMl: 2100 },
		);
		expect(plan.some((p) => p.at.getDate() === 23)).toBe(false);
		expect(plan.some((p) => p.at.getDate() === 24)).toBe(true);
	});

	it("respeita o horário escolhido", () => {
		const plan = planHydrationReminders(
			{
				...DEFAULT_REMINDERS,
				isOn: true,
				days: ALL_DAYS,
				startHour: 15,
				endHour: 17,
				everyMin: 60,
			},
			{ todayMl: 900, dayMl: 2100 },
		);
		const hours = plan.filter((p) => p.at.getDate() === 23).map((p) => p.at.getHours());
		expect(hours).toEqual([15, 16, 17]);
	});
});
