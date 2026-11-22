import { planHydrationReminders } from "../notifications";
import { DEFAULT_REMINDERS, IHydroReminders } from "../store";

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const on = (o: Partial<IHydroReminders>): IHydroReminders => ({
	...DEFAULT_REMINDERS,
	isOn: true,
	days: ALL_DAYS,
	startHour: 8,
	endHour: 10,
	everyMin: 60,
	...o,
});

describe("planHydrationReminders", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		// Uma segunda-feira
		jest.setSystemTime(new Date(2026, 10, 23, 12, 0, 0));
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it("todo dia: repete sozinho em cada horário e diz quanto falta beber", () => {
		const plan = planHydrationReminders(on({}), { todayMl: 1500, dayMl: 2100 });
		expect(plan.map((p) => p.hour)).toEqual([8, 9, 10]);
		expect(plan.every((p) => p.weekday === null)).toBe(true);
		expect(plan[0]?.body).toBe("Falta você beber 1,5 L de água hoje. Já bebeu?");
	});

	it("meta de hoje batida: o lembrete continua, com a meta do dia", () => {
		const plan = planHydrationReminders(on({}), { todayMl: 0, dayMl: 2100 });
		expect(plan).toHaveLength(3);
		expect(plan[0]?.body).toBe(
			"Sua meta de água é de cerca de 2,1 L por dia. Já bebeu um copo agora?",
		);
	});

	it("dias escolhidos: hoje o que falta, os outros dias a meta inteira", () => {
		const plan = planHydrationReminders(on({ days: [1, 3], startHour: 15, endHour: 15 }), {
			todayMl: 900,
			dayMl: 2100,
		});
		const monday = plan.find((p) => p.weekday === 2);
		const wednesday = plan.find((p) => p.weekday === 4);
		expect(monday?.body).toBe("Falta você beber 900 ml de água hoje. Já bebeu?");
		expect(wednesday?.body).toBe("Falta você beber 2,1 L de água hoje. Já bebeu?");
		expect(monday?.hour).toBe(15);
	});
});
