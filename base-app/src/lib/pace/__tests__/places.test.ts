import { countryOf, OTHER_PLACE, placeOptions } from "../places";

describe("lugares da equipe", () => {
	it("põe a cidade do atleta primeiro e Outra no fim", () => {
		const options = placeOptions(["Campinas", "Valinhos"], "Valinhos");
		expect(options).toEqual(["Valinhos", "Campinas", OTHER_PLACE]);
	});

	it("país fora da lista só tem Outra para digitar", () => {
		expect(placeOptions(countryOf("NZ").cities)).toEqual([OTHER_PLACE]);
	});
});
