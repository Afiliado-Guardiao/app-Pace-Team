import { toShareLook } from "../shareLook";

describe("Bud no compartilhar (só Buddy Studio)", () => {
	it("aparece com acessório pago do Studio", () => {
		expect(toShareLook({ color: "branco", accessories: ["viking"] })).toEqual({
			color: "branco",
			accessories: ["viking"],
		});
	});

	it("não aparece sem acessório pago (nem com os ganhos correndo)", () => {
		expect(toShareLook({ color: "ouro", accessories: ["coroa", "oculos"] })).toBeNull();
		expect(toShareLook({ color: "branco", accessories: [] })).toBeNull();
	});

	it("ignora dados estranhos de posts antigos", () => {
		expect(toShareLook(null)).toBeNull();
		expect(toShareLook({ color: "rosa-choque", accessories: ["viking"] })).toBeNull();
		expect(toShareLook({ color: "azul", accessories: ["viking", "inventado"] })).toEqual({
			color: "azul",
			accessories: ["viking"],
		});
	});
});
