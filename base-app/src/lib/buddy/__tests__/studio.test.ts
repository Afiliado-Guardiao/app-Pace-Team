import { withStudio } from "../rules";
import { EMPTY_STUDIO } from "../store";

const LOOK = { color: "azul" as const, accessories: ["faixa" as const] };

describe("Buddy Studio: cor, acessório e efeito somam", () => {
	it("usa os três ao mesmo tempo", () => {
		const studio = {
			...EMPTY_STUDIO,
			color: "neon" as const,
			head: "samurai" as const,
			effect: "fogo" as const,
		};
		expect(withStudio(LOOK, studio)).toEqual({
			color: "neon",
			accessories: ["samurai"],
			effect: "fogo",
		});
	});

	it("só com a cor, continua com o que conquistou", () => {
		expect(withStudio(LOOK, { ...EMPTY_STUDIO, color: "neon" })).toEqual({
			color: "neon",
			accessories: ["faixa"],
			effect: null,
		});
	});
});
