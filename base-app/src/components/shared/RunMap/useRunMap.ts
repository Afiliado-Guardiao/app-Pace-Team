import { useCallback, useEffect, useMemo, useRef } from "react";

import type MapView from "react-native-maps";
import type { LatLng, Region } from "react-native-maps";

import { ILatLng } from "./types";

interface IUseRunMapOptions {
	route: readonly ILatLng[];
	progress: number;
	me?: ILatLng | null;
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

// Enquadra a rota (padding 40, como o fitBounds do protótipo) e calcula o
// trecho desenhado e a posição do atleta.
export const useRunMap = ({ route, progress, me }: IUseRunMapOptions): IUseRunMapReturn => {
	const ref = useRef<MapView | null>(null);
	const count = Math.max(1, Math.round(route.length * Math.min(1, Math.max(0, progress))));
	const drawn = route.slice(0, count);
	const fullCoords = useMemo(() => route.map(toLatLng), [route]);
	const drawnCoords = useMemo(() => drawn.map(toLatLng), [drawn]);
	const first = route.at(0);
	const last = route.at(-1);
	const tip = drawn.at(-1);
	const center = me ?? first ?? FALLBACK;

	const fit = useCallback(() => {
		if (route.length > 1) {
			ref.current?.fitToCoordinates(fullCoords, {
				edgePadding: { top: EDGE, right: EDGE, bottom: EDGE, left: EDGE },
				animated: false,
			});
		}
	}, [route.length, fullCoords]);

	useEffect(() => {
		if (me && route.length <= 1) {
			ref.current?.animateCamera({ center: toLatLng(me) }, { duration: 400 });
		}
	}, [me, route.length]);

	return {
		ref,
		initialRegion: {
			latitude: center[0],
			longitude: center[1],
			latitudeDelta: SPAN,
			longitudeDelta: SPAN,
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
