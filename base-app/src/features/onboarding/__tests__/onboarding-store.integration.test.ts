import { useStore } from "@/store";

import { resetAllStores } from "../../../__tests__/helpers/mockStore";

describe("Onboarding Store Integration", () => {
	beforeEach(() => {
		resetAllStores();
	});

	describe("setAnswer()", () => {
		it("should save answer for a step", () => {
			const { setAnswer } = useStore.getState();

			setAnswer("name", "John Doe");

			const state = useStore.getState();
			expect(state.answers.name).toBe("John Doe");
		});

		it("should save array answer for multi-select step", () => {
			const { setAnswer } = useStore.getState();

			setAnswer("goals", ["fitness", "health"]);

			const state = useStore.getState();
			expect(state.answers.goals).toEqual(["fitness", "health"]);
		});

		it("should overwrite previous answer for same step", () => {
			const { setAnswer } = useStore.getState();

			setAnswer("name", "First Name");
			setAnswer("name", "Second Name");

			const state = useStore.getState();
			expect(state.answers.name).toBe("Second Name");
		});
	});

	describe("setCurrentStepIndex()", () => {
		it("should update current step index", () => {
			const { setCurrentStepIndex } = useStore.getState();

			setCurrentStepIndex(5);

			const state = useStore.getState();
			expect(state.currentStepIndex).toBe(5);
		});

		it("should allow going back to previous step", () => {
			const { setCurrentStepIndex } = useStore.getState();

			setCurrentStepIndex(10);
			setCurrentStepIndex(5);

			const state = useStore.getState();
			expect(state.currentStepIndex).toBe(5);
		});
	});

	describe("setCompleted()", () => {
		it("should mark onboarding as completed", () => {
			const { setCompleted } = useStore.getState();

			setCompleted(true);

			const state = useStore.getState();
			expect(state.isCompleted).toBe(true);
		});

		it("should allow marking as not completed", () => {
			const { setCompleted } = useStore.getState();

			setCompleted(true);
			setCompleted(false);

			const state = useStore.getState();
			expect(state.isCompleted).toBe(false);
		});
	});

	describe("setOnboardingId()", () => {
		it("should save onboarding ID", () => {
			const { setOnboardingId } = useStore.getState();

			setOnboardingId("onboarding-123");

			const state = useStore.getState();
			expect(state.onboardingId).toBe("onboarding-123");
		});
	});

	describe("resetOnboarding()", () => {
		it("should reset all onboarding data to initial state", () => {
			const { setAnswer, setCurrentStepIndex, setCompleted, setOnboardingId, resetOnboarding } =
				useStore.getState();

			setAnswer("name", "John");
			setAnswer("email", "john@example.com");
			setCurrentStepIndex(10);
			setCompleted(true);
			setOnboardingId("onboarding-123");

			resetOnboarding();

			const state = useStore.getState();
			expect(state.answers).toEqual({});
			expect(state.currentStepIndex).toBe(0);
			expect(state.isCompleted).toBe(false);
			expect(state.onboardingId).toBeNull();
		});
	});

	describe("answers persistence", () => {
		it("should maintain answers when navigating between steps", () => {
			const { setAnswer, setCurrentStepIndex } = useStore.getState();

			setAnswer("name", "John");
			setCurrentStepIndex(1);

			setAnswer("gender", "male");
			setCurrentStepIndex(2);

			setCurrentStepIndex(0);

			const state = useStore.getState();
			expect(state.answers.name).toBe("John");
			expect(state.answers.gender).toBe("male");
		});
	});
});
