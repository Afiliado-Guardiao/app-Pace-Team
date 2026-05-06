import {
	formatBirthdayForBackend,
	formatMeasurementsForBackend,
	parseAnswerForBackend,
} from "@/features/onboarding/utils/formatters";

describe("formatBirthdayForBackend", () => {
	it("formats a complete birthday correctly", () => {
		const value = JSON.stringify({ day: "5", month: "march", year: "1990" });

		expect(formatBirthdayForBackend(value)).toBe("1990-03-05");
	});

	it("pads single-digit day with leading zero", () => {
		const value = JSON.stringify({ day: "3", month: "january", year: "2000" });

		expect(formatBirthdayForBackend(value)).toBe("2000-01-03");
	});

	it("maps all months correctly", () => {
		const months: [string, string][] = [
			["january", "01"],
			["february", "02"],
			["march", "03"],
			["april", "04"],
			["may", "05"],
			["june", "06"],
			["july", "07"],
			["august", "08"],
			["september", "09"],
			["october", "10"],
			["november", "11"],
			["december", "12"],
		];

		months.forEach(([month, expected]) => {
			const value = JSON.stringify({ day: "01", month, year: "2000" });
			expect(formatBirthdayForBackend(value)).toBe(`2000-${expected}-01`);
		});
	});

	it("defaults missing day to 01", () => {
		const value = JSON.stringify({ month: "june", year: "1985" });

		expect(formatBirthdayForBackend(value)).toBe("1985-06-01");
	});

	it("defaults missing month to 01", () => {
		const value = JSON.stringify({ day: "15", year: "1985" });

		expect(formatBirthdayForBackend(value)).toBe("1985-01-15");
	});

	it("defaults missing year to 2000", () => {
		const value = JSON.stringify({ day: "10", month: "april" });

		expect(formatBirthdayForBackend(value)).toBe("2000-04-10");
	});

	it("defaults unknown month to 01", () => {
		const value = JSON.stringify({ day: "01", month: "unknownMonth", year: "2000" });

		expect(formatBirthdayForBackend(value)).toBe("2000-01-01");
	});

	it("returns empty string for invalid JSON", () => {
		expect(formatBirthdayForBackend("not-json")).toBe("");
	});
});

describe("formatMeasurementsForBackend", () => {
	it("formats height and weight as strings", () => {
		const value = JSON.stringify({ height: 175, weight: 80 });

		expect(formatMeasurementsForBackend(value)).toEqual({ height: "175", weight: "80" });
	});

	it("works with string values", () => {
		const value = JSON.stringify({ height: "180", weight: "75" });

		expect(formatMeasurementsForBackend(value)).toEqual({ height: "180", weight: "75" });
	});

	it("defaults missing height to 170", () => {
		const value = JSON.stringify({ weight: 60 });

		expect(formatMeasurementsForBackend(value)).toEqual({ height: "170", weight: "60" });
	});

	it("defaults missing weight to 70", () => {
		const value = JSON.stringify({ height: 165 });

		expect(formatMeasurementsForBackend(value)).toEqual({ height: "165", weight: "70" });
	});

	it("returns null for invalid JSON", () => {
		expect(formatMeasurementsForBackend("invalid")).toBeNull();
	});
});

describe("parseAnswerForBackend", () => {
	it("returns undefined for undefined value", () => {
		expect(parseAnswerForBackend("anyStep", undefined)).toBeUndefined();
	});

	it("returns undefined for empty string value", () => {
		expect(parseAnswerForBackend("anyStep", "")).toBeUndefined();
	});

	it("returns array values as-is", () => {
		const value = ["option1", "option2"];

		expect(parseAnswerForBackend("multiSelect", value)).toEqual(["option1", "option2"]);
	});

	it("formats birthday step through formatBirthdayForBackend", () => {
		const value = JSON.stringify({ day: "12", month: "october", year: "1995" });

		expect(parseAnswerForBackend("birthday", value)).toBe("1995-10-12");
	});

	it("formats measurements step through formatMeasurementsForBackend", () => {
		const value = JSON.stringify({ height: 170, weight: 65 });

		expect(parseAnswerForBackend("measurements", value)).toEqual({ height: "170", weight: "65" });
	});

	it("returns raw string for generic steps", () => {
		expect(parseAnswerForBackend("gender", "male")).toBe("male");
	});

	it("returns raw string for unknown stepId", () => {
		expect(parseAnswerForBackend("customStep", "someValue")).toBe("someValue");
	});
});
