import { useCallback, useEffect, useMemo, useRef } from "react";

import type MapView from "react-native-maps";
import type { LatLng, Region } from "react-native-maps";

import { ILatLng } from "./types";

interface IUseRunMapOptions {
	route: readonly ILatLng[];
	progress: number;
	me?: ILatLng | null;
	follow?: boolean;
}

interface IUseRunMapReturn {
	ref: React.RefObject<MapView | null>;
	initialRegion: Region;
	drawn: readonly ILatLng[];
	fullCoords: LatLng[];
	drawnCoords: LatLng[];
	start: LatLng | null;
	end: LatLng | null;
	mePosition: LatLng | null;
	fit: () => void;
}

const toLatLng = (p: ILatLng): LatLng => ({ latitude: p[0], longitude: p[1] });
const EDGE = 40;
const FALLBACK: ILatLng = [-23.5855, -46.6565];
const SPAN = 0.012;
// Acompanhando a corrida: bem perto, para ver as ruas por onde passa
const FOLLOW_SPAN = 0.004;
const FOLLOW_MS = 600;

// Enquadra a rota (padding 40, como o fitBounds do protótipo) e calcula o
// trecho desenhado e a posição do atleta.
export const useRunMap = ({
	route,
	progress,
	me,
	follow = false,
}: IUseRunMapOptions): IUseRunMapReturn => {
	const ref = useRef<MapView | null>(null);
	const hasCentered = useRef(false);
	const count = Math.max(1, Math.round(route.length * Math.min(1, Math.max(0, progress))));
	const drawn = route.slice(0, count);
	const fullCoords = useMemo(() => route.map(toLatLng), [route]);
	const drawnCoords = useMemo(() => drawn.map(toLatLng), [drawn]);
	const first = route.at(0);
	const last = route.at(-1);
	const tip = drawn.at(-1);
	const center = (follow ? (me ?? tip) : me) ?? first ?? FALLBACK;
	const target = follow ? (me ?? tip) : me;
	const targetLat = target?.[0];
	const targetLng = target?.[1];

	const fit = useCallback(() => {
		if (!follow && route.length > 1) {
			ref.current?.fitToCoordinates(fullCoords, {
				edgePadding: { top: EDGE, right: EDGE, bottom: EDGE, left: EDGE },
				animated: false,
			});
		}
	}, [follow, route.length, fullCoords]);

	// Correndo: a câmera vai junto a cada posição nova. Parado (preparar
	// corrida): centraliza uma vez e deixa o atleta arrastar e dar zoom.
	useEffect(() => {
		if (targetLat === undefined || targetLng === undefined) return;
		if (!follow && (hasCentered.current || route.length > 1)) return;
		hasCentered.current = true;
		ref.current?.animateCamera(
			{ center: { latitude: targetLat, longitude: targetLng } },
			{ duration: follow ? FOLLOW_MS : 400 },
		);
	}, [follow, targetLat, targetLng, route.length]);

	return {
		ref,
		initialRegion: {
			latitude: center[0],
			longitude: center[1],
			latitudeDelta: follow ? FOLLOW_SPAN : SPAN,
			longitudeDelta: follow ? FOLLOW_SPAN : SPAN,
		},
		drawn,
		fullCoords,
		drawnCoords,
		start: first ? toLatLng(first) : null,
		end: last ? toLatLng(last) : null,
		mePosition: me ? toLatLng(me) : tip ? toLatLng(tip) : null,
		fit,
	};
};
