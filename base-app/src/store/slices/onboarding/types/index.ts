export interface IOnboardingAnswers {
	name?: string;
	email?: string;
	birthday?: string;
	[key: string]: string | undefined;
}

export interface IOnboardingSlice {
	currentStepIndex: number;
	answers: Partial<IOnboardingAnswers>;
	isCompleted: boolean;
	onboardingId: string | null;
	anonymousUserId: string | null;
	setCurrentStepIndex: (index: number) => void;
	setAnswer: (key: keyof IOnboardingAnswers, value: string) => void;
	setCompleted: (completed: boolean) => void;
	setOnboardingId: (id: string | null) => void;
	getOrGenerateAnonymousUserId: () => string;
	resetOnboarding: () => void;
}
