import AsyncStorage from "@react-native-async-storage/async-storage";

import { useStore } from "@/store";

import { resetAllStores } from "../../../__tests__/helpers/mockStore";

describe("Auth Store Integration", () => {
	beforeEach(() => {
		resetAllStores();
		AsyncStorage.clear();
	});

	describe("login()", () => {
		it("should set user and token in store", () => {
			const { login } = useStore.getState();

			const user = {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
			};

			const token = "mock-jwt-token";

			login(user, token);

			const state = useStore.getState();
			expect(state.user).toEqual(user);
			expect(state.token).toBe(token);
			expect(state.isAuthenticated).toBe(true);
		});

		it("should persist token in AsyncStorage", async () => {
			const { login } = useStore.getState();

			const user = {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
			};

			login(user, "test-token");

			await new Promise((resolve) => setTimeout(resolve, 100));

			const storedData = await AsyncStorage.getItem("auth-storage");
			expect(storedData).toBeDefined();

			if (storedData) {
				const parsed = JSON.parse(storedData);
				expect(parsed.state.token).toBe("test-token");
				expect(parsed.state.user.id).toBe("user-123");
			}
		});
	});

	describe("logout()", () => {
		it("should clear user and token from store", () => {
			const { login, logout } = useStore.getState();

			login(
				{
					id: "user-123",
					email: "test@example.com",
					name: "Test User",
				},
				"token",
			);

			logout();

			const state = useStore.getState();
			expect(state.user).toBeNull();
			expect(state.token).toBeNull();
			expect(state.isAuthenticated).toBe(false);
		});

		it("should clear AsyncStorage on logout", async () => {
			const { login, logout } = useStore.getState();

			login(
				{
					id: "user-123",
					email: "test@example.com",
					name: "Test User",
				},
				"token",
			);

			await new Promise((resolve) => setTimeout(resolve, 100));

			logout();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const storedData = await AsyncStorage.getItem("auth-storage");

			if (storedData) {
				const parsed = JSON.parse(storedData);
				expect(parsed.state.token).toBeNull();
				expect(parsed.state.user).toBeNull();
			}
		});
	});

	describe("isAuthenticated", () => {
		it("should be false by default", () => {
			const state = useStore.getState();
			expect(state.isAuthenticated).toBe(false);
		});

		it("should be true after login", () => {
			const { login } = useStore.getState();

			login(
				{
					id: "user-123",
					email: "test@example.com",
					name: "Test User",
				},
				"token",
			);

			expect(useStore.getState().isAuthenticated).toBe(true);
		});

		it("should be false after logout", () => {
			const { login, logout } = useStore.getState();

			login(
				{
					id: "user-123",
					email: "test@example.com",
					name: "Test User",
				},
				"token",
			);
			logout();

			expect(useStore.getState().isAuthenticated).toBe(false);
		});
	});
});
