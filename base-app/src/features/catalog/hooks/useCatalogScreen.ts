import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { ROUTES } from "@/constants/routes";

import { CHIP_OPTIONS, RANK_SCOPES } from "../constants";
import { ICatalogState } from "../types";

// Estado das demonstrações do catálogo (chips, abas, folha, formulários).
// replay() remonta as seções para rever as animações de entrada.
export const useCatalogScreen = (): ICatalogState => {
	const router = useRouter();
	const [replayKey, setReplayKey] = useState(0);
	const [chip, setChip] = useState<string>(CHIP_OPTIONS[0]);
	const [scope, setScope] = useState<string>(RANK_SCOPES[0]);
	const [teamSize, setTeamSize] = useState("5x5");
	const [email, setEmail] = useState("");
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [notifications, setNotifications] = useState(true);
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [tab, setTab] = useState("home");

	const openSheet = useCallback(() => {
		setIsSheetOpen(true);
	}, []);
	const closeSheet = useCallback(() => {
		setIsSheetOpen(false);
	}, []);
	const replay = useCallback(() => {
		setReplayKey((key) => key + 1);
	}, []);
	const goBack = useCallback(() => {
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.WELCOME);
	}, [router]);

	return {
		replayKey,
		chip,
		setChip,
		scope,
		setScope,
		teamSize,
		setTeamSize,
		email,
		setEmail,
		acceptedTerms,
		setAcceptedTerms,
		notifications,
		setNotifications,
		isSheetOpen,
		openSheet,
		closeSheet,
		tab,
		setTab,
		replay,
		goBack,
	};
};
