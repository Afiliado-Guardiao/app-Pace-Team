import { useStore } from "@/store";

import { resetAllStores } from "@/__tests__/helpers/mockStore";

const MOCK_UUID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

jest.mock("expo-crypto", () => ({
	randomUUID: jest.fn(() => MOCK_UUID),
}));

describe("onboarding slice — anonymousUserId", () => {
	beforeEach(() => {
		resetAllStores();
		jest.clearAllMocks();
	});

	it("initializes with anonymousUserId null", () => {
		expect(useStore.getState().anonymousUserId).toBeNull();
	});

	describe("getOrGenerateAnonymousUserId", () => {
		it("returns existing id without generating a new one", () => {
			useStore.setState({ anonymousUserId: "existing-id" });

			const result = useStore.getState().getOrGenerateAnonymousUserId();

			expect(result).toBe("existing-id");
		});

		it("generates and stores a uuid when anonymousUserId is null", () => {
			const result = useStore.getState().getOrGenerateAnonymousUserId();

			expect(result).toBe(MOCK_UUID);
			expect(useStore.getState().anonymousUserId).toBe(MOCK_UUID);
		});

		it("does not call randomUUID when id already exists", () => {
			const { randomUUID } = require("expo-crypto");
			useStore.setState({ anonymousUserId: "existing-id" });

			useStore.getState().getOrGenerateAnonymousUserId();

			expect(randomUUID).not.toHaveBeenCalled();
		});

		it("calls randomUUID exactly once when no id exists", () => {
			const { randomUUID } = require("expo-crypto");

			useStore.getState().getOrGenerateAnonymousUserId();

			expect(randomUUID).toHaveBeenCalledTimes(1);
		});

		it("returns same id on subsequent calls", () => {
			const first = useStore.getState().getOrGenerateAnonymousUserId();
			const second = useStore.getState().getOrGenerateAnonymousUserId();

			expect(first).toBe(second);
		});
	});
});
