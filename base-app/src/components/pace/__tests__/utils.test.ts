import { formatCountUp, initialsOf, linearGeometry, parseCountUp } from "../utils";

describe("PACE utils", () => {
	it("parses pt-BR numbers like the design system CountUp", () => {
		expect(parseCountUp("2.140")).toMatchObject({ isNumeric: true, target: 2140, grouping: true });
		expect(parseCountUp("32,4")).toMatchObject({ isNumeric: true, target: 32.4, decimals: 1 });
		expect(parseCountUp("+86")).toMatchObject({ isNumeric: true, prefix: "+", target: 86 });
		expect(parseCountUp("4º")).toMatchObject({ isNumeric: true, suffix: "º", target: 4 });
	});

	it("keeps paces and times as text", () => {
		expect(parseCountUp("5'12\"").isNumeric).toBe(false);
		expect(parseCountUp("45:25").isNumeric).toBe(false);
	});

	it("formats the final value back in pt-BR", () => {
		expect(formatCountUp(2140, parseCountUp("2.140"))).toBe("2.140");
		expect(formatCountUp(32.4, parseCountUp("32,4"))).toBe("32,4");
		expect(formatCountUp(86, parseCountUp("+86"))).toBe("+86");
	});

	it("builds avatar initials from up to two words", () => {
		expect(initialsOf("Lucas Moreira Silva")).toBe("LM");
		expect(initialsOf("")).toBe("");
	});

	it("matches CSS linear-gradient geometry", () => {
		// 90deg = esquerda → direita
		expect(linearGeometry(90, 100, 20)).toMatchObject({ x1: 0, x2: 100 });
		// 180deg = cima → baixo
		const down = linearGeometry(180, 100, 20);
		expect(down.y1).toBeCloseTo(0);
		expect(down.y2).toBeCloseTo(20);
	});
});
