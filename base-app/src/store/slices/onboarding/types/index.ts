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
	setCurrentStepIndex: (index: number) => void;
	setAnswer: (key: keyof IOnboardingAnswers, value: string) => void;
	setCompleted: (completed: boolean) => void;
	resetOnboarding: () => void;
}
