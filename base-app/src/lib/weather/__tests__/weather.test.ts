import { toWeather } from "../weather";

const NOON = new Date(2026, 10, 5, 12, 0);
const MIDNIGHT = new Date(2026, 10, 5, 23, 30);

describe("toWeather", () => {
	it("sem previsão usa dia/noite pelo relógio", () => {
		expect(toWeather(null, NOON).preset).toBe("day");
		expect(toWeather(null, MIDNIGHT).preset).toBe("night");
	});

	it("sol cresce com o calor", () => {
		const mild = toWeather({ temp: 24, symbol: "clearsky_day", rainMm: 0 }, NOON);
		const hot = toWeather({ temp: 38, symbol: "clearsky_day", rainMm: 0 }, NOON);
		expect(mild.preset).toBe("day");
		expect(mild.sun).toBeCloseTo(0.36, 2);
		expect(hot.preset).toBe("hot");
		expect(hot.sun).toBe(1);
	});

	it("chuva e temporal pelos mm previstos", () => {
		const rain = toWeather({ temp: 18, symbol: "rain", rainMm: 3.2 }, NOON);
		expect(rain.preset).toBe("rain");
		expect(rain.rain).toBeCloseTo(0.4, 2);
		const storm = toWeather({ temp: 18, symbol: "heavyrainandthunder", rainMm: 2 }, NOON);
		expect(storm.preset).toBe("storm");
		expect(storm.rain).toBeGreaterThan(0.8);
	});

	it("pancada fraca possível não vira chuva na tela", () => {
		const drizzle = toWeather({ temp: 24, symbol: "lightrainshowers_day", rainMm: 0.1 }, NOON);
		expect(drizzle.preset).toBe("day");
		expect(drizzle.rain).toBe(0);
		const thunderNoRain = toWeather(
			{ temp: 24, symbol: "rainshowersandthunder_day", rainMm: 0 },
			NOON,
		);
		expect(thunderNoRain.preset).toBe("day");
	});

	it("frio e noite", () => {
		expect(toWeather({ temp: 6, symbol: "cloudy", rainMm: 0 }, NOON).preset).toBe("cold");
		expect(toWeather({ temp: 20, symbol: "clearsky_night", rainMm: 0 }, NOON).preset).toBe("night");
	});
});
