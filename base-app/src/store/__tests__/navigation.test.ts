import { useStore } from "@/store";

import { resetAllStores } from "@/__tests__/helpers/mockStore";

describe("navigation slice", () => {
	beforeEach(() => {
		resetAllStores();
	});

	it("initializes with lastRoute null", () => {
		expect(useStore.getState().lastRoute).toBeNull();
	});

	it("setLastRoute stores the given route", () => {
		useStore.getState().setLastRoute("/home");

		expect(useStore.getState().lastRoute).toBe("/home");
	});

	it("setLastRoute overwrites the previous route", () => {
		useStore.getState().setLastRoute("/home");
		useStore.getState().setLastRoute("/profile");

		expect(useStore.getState().lastRoute).toBe("/profile");
	});

	it("setLastRoute accepts nested route paths", () => {
		useStore.getState().setLastRoute("/settings/account");

		expect(useStore.getState().lastRoute).toBe("/settings/account");
	});
});
