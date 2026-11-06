import { useCallback, useEffect, useMemo, useRef } from "react";

import type MapView from "react-native-maps";
import type { LatLng, Region } from "react-native-maps";

import { ILatLng } from "./types";

interface IUseRunMapOptions {
	route: readonly ILatLng[];
	progress: number;
	me?: ILatLng | null;
	follow?: boolean;
	recenter?: number;
	// Outros pontos que precisam caber no enquadramento (percursos dos colegas)
	extra?: readonly ILatLng[];
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
const RECENTER_MS = 500;

// Enquadra a rota (padding 40, como o fitBounds do protótipo) e calcula o
// trecho desenhado e a posição do atleta.
export const useRunMap = ({
	route,
	progress,
	me,
	follow = false,
	recenter,
	extra,
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

	const fitCoords = useMemo(
		() => (extra && extra.length > 0 ? [...fullCoords, ...extra.map(toLatLng)] : fullCoords),
		[fullCoords, extra],
	);

	const fit = useCallback(() => {
		if (!follow && fitCoords.length > 1) {
			ref.current?.fitToCoordinates(fitCoords, {
				edgePadding: { top: EDGE, right: EDGE, bottom: EDGE, left: EDGE },
				animated: false,
			});
		}
	}, [follow, fitCoords]);

	// Os percursos dos colegas chegam depois do mapa abrir: enquadra de novo
	useEffect(() => {
		fit();
	}, [fit]);

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

	// Mira: vai até o atleta, bem perto. Só quando a pessoa toca na mira (a
	// posição fica guardada à parte para não mover a câmera a cada passo).
	const latestMe = useRef(me);
	latestMe.current = me;
	useEffect(() => {
		const point = latestMe.current;
		if (!recenter || !point) return;
		ref.current?.animateToRegion(
			{
				latitude: point[0],
				longitude: point[1],
				latitudeDelta: FOLLOW_SPAN,
				longitudeDelta: FOLLOW_SPAN,
			},
			RECENTER_MS,
		);
	}, [recenter]);

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
