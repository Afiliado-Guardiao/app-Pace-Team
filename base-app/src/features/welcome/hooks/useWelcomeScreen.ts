import { useCallback } from "react";

import { useRouter } from "expo-router";

import { WELCOME_ROUTES } from "../constants";
import { IWelcomeScreenData } from "../types";

export const useWelcomeScreen = (): IWelcomeScreenData => {
	const router = useRouter();

	const handleStartOnboarding = useCallback(() => {
		router.push(WELCOME_ROUTES.ONBOARDING);
	}, [router]);

	return {
		handleStartOnboarding,
	};
};
