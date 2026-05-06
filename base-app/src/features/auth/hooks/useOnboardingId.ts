import { onboardingApi } from "@/lib/api/onboarding";
import { useStore } from "@/store";

export interface IUseOnboardingIdReturn {
	getOrCreateOnboardingId: () => Promise<string>;
}

export const useOnboardingId = (): IUseOnboardingIdReturn => {
	const onboardingId = useStore((state) => state.onboardingId);
	const setOnboardingId = useStore((state) => state.setOnboardingId);
	const getOrGenerateAnonymousUserId = useStore((state) => state.getOrGenerateAnonymousUserId);

	const getOrCreateOnboardingId = async (): Promise<string> => {
		if (onboardingId) return onboardingId;
		const anonymousUserId = getOrGenerateAnonymousUserId();
		const { id } = await onboardingApi.createOnboarding(anonymousUserId);
		setOnboardingId(id);
		return id;
	};

	return { getOrCreateOnboardingId };
};
