import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { useReducedMotion } from "react-native-reanimated";

import { IBuddyDotsMode } from "@/components/buddy";

// Bolinhas na tela antes de o Bud aparecer ("pensando")
const DOTS_MS = 950;

// O Bud chegou voando da página anterior (?arrive=1): aparece como as três
// bolinhas do carregamento e logo vira o Bud para conversar
export const useBudArrival = (): IBuddyDotsMode => {
	const { arrive } = useLocalSearchParams<{ arrive?: string }>();
	const isReduced = useReducedMotion();
	const [mode, setMode] = useState<IBuddyDotsMode>(arrive === "1" && !isReduced ? "dots" : "bud");

	useEffect(() => {
		if (mode === "bud") return undefined;
		const timer = setTimeout(() => {
			setMode("bud");
		}, DOTS_MS);
		return () => {
			clearTimeout(timer);
		};
	}, [mode]);

	return mode;
};
