import { useStore } from "@/store";

import { resetAllStores } from "@/__tests__/helpers/mockStore";

describe("language slice", () => {
	beforeEach(() => {
		resetAllStores();
	});

	it("initializes with language null", () => {
		expect(useStore.getState().language).toBeNull();
	});

	it("setLanguage sets pt-BR", () => {
		useStore.getState().setLanguage("pt-BR");

		expect(useStore.getState().language).toBe("pt-BR");
	});

	it("setLanguage sets en-US", () => {
		useStore.getState().setLanguage("en-US");

		expect(useStore.getState().language).toBe("en-US");
	});

	it("setLanguage sets es-ES", () => {
		useStore.getState().setLanguage("es-ES");

		expect(useStore.getState().language).toBe("es-ES");
	});

	it("setLanguage overwrites the previous value", () => {
		useStore.getState().setLanguage("pt-BR");
		useStore.getState().setLanguage("en-US");

		expect(useStore.getState().language).toBe("en-US");
	});
});
