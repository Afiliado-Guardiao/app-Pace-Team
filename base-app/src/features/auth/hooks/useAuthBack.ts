import { useCallback } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { IAuthBackData } from "../types";

export const useAuthBack = (): IAuthBackData => {
	const router = useRouter();
	const setCompleted = useStore((state) => state.setCompleted);

	const handleBack = useCallback(() => {
		setCompleted(false);
		router.push(ROUTES.ONBOARDING);
	}, [router, setCompleted]);

	return {
		handleBack,
	};
};
