import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { SLIDES } from "../constants";

interface IUseOnboardingScreenReturn {
	step: number;
	isOrbit: boolean;
	goToStep: (step: number) => void;
	handleNext: () => void;
	handleFinish: () => void;
}

// Apresentação: 2 fotos e a órbita. "Pular" e o fim da órbita levam às
// boas-vindas e marcam a apresentação como vista (não repete no próximo acesso).
export const useOnboardingScreen = (): IUseOnboardingScreenReturn => {
	const router = useRouter();
	const setCompleted = useStore((state) => state.setCompleted);
	const [step, setStep] = useState(0);

	const handleFinish = useCallback(() => {
		setCompleted(true);
		router.replace(ROUTES.WELCOME);
	}, [router, setCompleted]);

	const handleNext = useCallback(() => {
		setStep((current) => Math.min(current + 1, SLIDES.length));
	}, []);

	return {
		step,
		isOrbit: step >= SLIDES.length,
		goToStep: setStep,
		handleNext,
		handleFinish,
	};
};
