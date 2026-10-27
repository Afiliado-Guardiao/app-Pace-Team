import { isValidStep } from "../geo";

const at = (meters: number, accuracy: number, seconds: number) => ({
	lat: -23.5 + meters / 111_320,
	lng: -46.6,
	t: seconds * 1000,
	accuracy,
});

describe("filtro do GPS", () => {
	it("aceita um passo normal de corrida", () => {
		expect(isValidStep(at(0, 5, 0), at(10, 5, 3))).toBe(true);
	});

	it("ignora o sinal oscilando parado (passo menor que metade do erro)", () => {
		expect(isValidStep(at(0, 18, 0), at(6, 18, 3))).toBe(false);
	});

	it("descarta ponto com erro grande ou rápido demais", () => {
		expect(isValidStep(at(0, 5, 0), at(10, 30, 3))).toBe(false);
		expect(isValidStep(at(0, 5, 0), at(100, 5, 3))).toBe(false);
	});
});
