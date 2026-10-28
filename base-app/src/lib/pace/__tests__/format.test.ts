import { distanceParts, formatDistance, formatDurationText } from "../format";

describe("números da corrida sem confusão", () => {
	it("abaixo de 1 km mostra metros", () => {
		expect(formatDistance(0.5109)).toBe("511 m");
		expect(distanceParts(1.25)).toEqual({ value: "1,25", unit: "km" });
	});

	it("tempo por extenso, sem parecer hora do relógio", () => {
		expect(formatDurationText(797)).toBe("13 min 17 s");
		expect(formatDurationText(3900)).toBe("1 h 05 min");
	});
});
