import { useStore } from "@/store";

import { resetAllStores } from "@/__tests__/helpers/mockStore";

describe("hydration slice", () => {
	beforeEach(() => {
		resetAllStores();
	});

	it("initializes with _hasHydrated false", () => {
		expect(useStore.getState()._hasHydrated).toBe(false);
	});

	it("setHasHydrated sets _hasHydrated to true", () => {
		useStore.getState().setHasHydrated(true);

		expect(useStore.getState()._hasHydrated).toBe(true);
	});

	it("setHasHydrated sets _hasHydrated back to false", () => {
		useStore.getState().setHasHydrated(true);
		useStore.getState().setHasHydrated(false);

		expect(useStore.getState()._hasHydrated).toBe(false);
	});
});
