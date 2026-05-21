import { useStore } from "@/store";
import { IUser } from "@/lib/supabase/types";

import { resetAllStores } from "../../../__tests__/helpers/mockStore";

const buildUser = (): IUser => ({
	id: "user-123",
	email: "test@example.com",
	name: "Test User",
	birthday: null,
	referralCode: "TEST123",
	isPremium: false,
	createdAt: new Date().toISOString(),
});

describe("Auth Store Integration", () => {
	beforeEach(() => {
		resetAllStores();
	});

	describe("setUser()", () => {
		it("sets the user and marks as authenticated", () => {
			const { setUser } = useStore.getState();
			const user = buildUser();

			setUser(user);

			const state = useStore.getState();
			expect(state.user).toEqual(user);
			expect(state.isAuthenticated).toBe(true);
		});

		it("clears the user and resets auth flags when called with null", () => {
			const { setUser, setHasSeenReferralPrompt } = useStore.getState();

			setUser(buildUser());
			setHasSeenReferralPrompt(true);

			setUser(null);

			const state = useStore.getState();
			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
			expect(state.hasSeenReferralPrompt).toBe(false);
		});
	});

	describe("isAuthenticated", () => {
		it("is false by default", () => {
			expect(useStore.getState().isAuthenticated).toBe(false);
		});

		it("is true after setUser with a user", () => {
			useStore.getState().setUser(buildUser());
			expect(useStore.getState().isAuthenticated).toBe(true);
		});

		it("is false after setUser(null)", () => {
			const { setUser } = useStore.getState();
			setUser(buildUser());
			setUser(null);
			expect(useStore.getState().isAuthenticated).toBe(false);
		});
	});
});
