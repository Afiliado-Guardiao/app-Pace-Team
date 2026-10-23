import { useCallback, useMemo, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

import { useRouter } from "expo-router";

import { useMyRuns } from "@/lib/data";
import { useTabRail } from "@/lib/hooks/useTabRail";
import { RUNS } from "@/lib/pace";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { MAP_SCOPES, ROUTE_CARD, SAVED_ROUTES } from "../constants";

type ILayer = "mine" | "teams";

const STEP = ROUTE_CARD.width + ROUTE_CARD.gap;
const MIN_ROUTE_POINTS = 2;
const MAX_ROUTES = 10;

// 07 Mapa: rotas salvas em carrossel ou bolhas de equipes por região.
export const useMapScreen = () => {
	const router = useRouter();
	const onRailChange = useTabRail();
	const railRef = useRef<ScrollView>(null);
	const [scope, setScope] = useState<string>(MAP_SCOPES[0]);
	const [layer, setLayer] = useState<ILayer>("mine");
	const [selected, setSelected] = useState(0);
	const { runs: myRuns, saved } = useMyRuns();

	// Minhas corridas com percurso; a prévia usa as rotas de exemplo do design
	const items = useMemo(() => {
		if (IS_PREVIEW)
			return RUNS.slice(0, SAVED_ROUTES.length).map((run, i) => ({
				run,
				route: SAVED_ROUTES.at(i) ?? [],
			}));
		return myRuns
			.map((run, i) => ({ run, route: saved.at(i)?.route ?? [] }))
			.filter((item) => item.route.length >= MIN_ROUTE_POINTS)
			.slice(0, MAX_ROUTES);
	}, [myRuns, saved]);
	const runs = useMemo(() => items.map((item) => item.run), [items]);

	const pick = useCallback((index: number) => {
		setSelected(index);
		railRef.current?.scrollTo({ x: index * STEP, animated: true });
	}, []);

	// Ao soltar o carrossel, seleciona o cartão mais próximo
	const onRailSettle = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const index = Math.round(event.nativeEvent.contentOffset.x / STEP);
			setSelected(Math.max(0, Math.min(runs.length - 1, index)));
		},
		[runs.length],
	);

	const openCard = useCallback(
		(index: number) => {
			const id = runs.at(index)?.id;
			if (index === selected)
				router.push({ pathname: ROUTES.RUN_DETAIL, params: typeof id === "string" ? { id } : {} });
			else pick(index);
		},
		[selected, router, pick, runs],
	);

	return {
		railRef,
		scope,
		setScope,
		isTeams: layer === "teams",
		showMine: () => {
			setLayer("mine");
		},
		showTeams: () => {
			setLayer("teams");
		},
		runs,
		selected,
		route: items.at(selected)?.route ?? [],
		isEmpty: items.length === 0,
		cardStep: STEP,
		pick,
		openCard,
		onRailSettle,
		onRailChange,
		goBack: () => {
			router.navigate(ROUTES.RUN);
		},
	};
};
