import { useCallback, useMemo, useRef, useState } from "react";
import { GestureResponderHandlers, PanResponder } from "react-native";

import * as Haptics from "expo-haptics";

import {
	SharedValue,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { PANEL_EASE, PANEL_MS, PANEL_SECTIONS, SWIPE } from "../constants";

export interface IPanelPager {
	index: number;
	// Posição contínua (segue o dedo; anima ao soltar)
	pos: SharedValue<number>;
	width: number;
	setWidth: (width: number) => void;
	goTo: (index: number) => void;
	// Toque logo depois de um arraste é ignorado
	guard: (fn: () => void) => () => void;
	handlers: GestureResponderHandlers;
	trackStyle: ReturnType<typeof useAnimatedStyle>;
}

// A seção atual vale pela sessão: ao voltar ao Início, abre onde parou
let lastIndex = 0;
const LAST = PANEL_SECTIONS.length - 1;
const clamp = (i: number): number => Math.max(0, Math.min(LAST, i));

// Troca de seção por toque na bolinha ou arraste (a página continua rolando
// na vertical: o arraste só vale depois de 8 px no eixo x)
export const usePanelPager = (): IPanelPager => {
	const reduceMotion = useReducedMotion();
	const [index, setIndex] = useState(lastIndex);
	const [width, setWidthState] = useState(0);
	const pos = useSharedValue(lastIndex);
	const indexRef = useRef(lastIndex);
	const widthRef = useRef(0);
	const draggedAt = useRef(0);

	const goTo = useCallback(
		(next: number) => {
			const i = clamp(next);
			// Trocou de seção: um toque leve no celular (como um seletor)
			if (i !== indexRef.current) {
				void Haptics.selectionAsync().catch(() => undefined);
			}
			indexRef.current = i;
			lastIndex = i;
			setIndex(i);
			pos.value = reduceMotion ? i : withTiming(i, { duration: PANEL_MS, easing: PANEL_EASE });
		},
		[pos, reduceMotion],
	);

	const setWidth = useCallback((w: number) => {
		widthRef.current = w;
		setWidthState((old) => (old === w ? old : w));
	}, []);

	const handlers = useMemo(() => {
		const dragOf = (dx: number): number => {
			const i = indexRef.current;
			const isEdge = (i === 0 && dx > 0) || (i === LAST && dx < 0);
			return isEdge ? dx * SWIPE.edge : dx;
		};
		return PanResponder.create({
			// Na captura: o arraste vale mesmo começando em cima de um botão
			onMoveShouldSetPanResponderCapture: (_, g) =>
				Math.abs(g.dx) > SWIPE.startX && Math.abs(g.dy) < SWIPE.cancelY,
			onPanResponderTerminationRequest: () => false,
			onPanResponderMove: (_, g) => {
				const w = widthRef.current || 1;
				pos.value = indexRef.current - dragOf(g.dx) / w;
			},
			onPanResponderRelease: (_, g) => {
				draggedAt.current = Date.now();
				const w = widthRef.current || 1;
				const d = dragOf(g.dx);
				const step = Math.abs(d) > w * SWIPE.threshold ? -Math.sign(d) : 0;
				goTo(indexRef.current + step);
			},
			onPanResponderTerminate: () => {
				goTo(indexRef.current);
			},
		}).panHandlers;
	}, [pos, goTo]);

	const guard = useCallback(
		(fn: () => void) => () => {
			if (Date.now() - draggedAt.current < SWIPE.clickGuardMs) return;
			fn();
		},
		[],
	);

	const trackStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: -pos.value * width }],
	}));

	return { index, pos, width, setWidth, goTo, guard, handlers, trackStyle };
};
