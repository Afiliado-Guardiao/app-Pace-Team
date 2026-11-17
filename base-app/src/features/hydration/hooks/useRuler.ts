import { useMemo, useRef, useState } from "react";
import {
	LayoutChangeEvent,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	ScrollView,
} from "react-native";

import * as Haptics from "expo-haptics";

// Distância entre dois riscos da régua (px)
export const RULER_GAP = 12;

export interface IRulerScale {
	min: number;
	max: number;
	step: number;
	// Risco maior a cada N passos; número a cada M passos
	majorEvery: number;
	labelEvery: number;
}

export interface IRulerTick {
	i: number;
	isMajor: boolean;
	label: string | null;
}

interface IUseRulerReturn {
	ticks: IRulerTick[];
	scrollRef: React.RefObject<ScrollView | null>;
	pad: number;
	onLayout: (e: LayoutChangeEvent) => void;
	onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const IS_WEB = Platform.OS === "web";

// Régua deitada: arrastar para os lados muda o valor; o risco no meio (laranja)
// é o escolhido. Vibra de leve a cada risco, como a roda do iPhone.
export const useRuler = (
	scale: IRulerScale,
	value: number,
	onChange: (value: number) => void,
): IUseRulerReturn => {
	const { min, max, step, majorEvery, labelEvery } = scale;
	const count = Math.round((max - min) / step) + 1;
	const scrollRef = useRef<ScrollView | null>(null);
	const [width, setWidth] = useState(0);
	const last = useRef(Math.round((value - min) / step));

	const ticks = useMemo(
		() =>
			Array.from({ length: count }, (_, i) => ({
				i,
				isMajor: i % majorEvery === 0,
				label: i % labelEvery === 0 ? String(Math.round(min + i * step)) : null,
			})),
		[count, majorEvery, labelEvery, min, step],
	);

	return {
		ticks,
		scrollRef,
		// Sobra dos lados para o primeiro e o último risco chegarem ao meio
		pad: Math.max(0, width / 2 - RULER_GAP / 2),
		onLayout: (e) => {
			setWidth(e.nativeEvent.layout.width);
			const x = last.current * RULER_GAP;
			requestAnimationFrame(() => {
				scrollRef.current?.scrollTo({ x, animated: false });
			});
		},
		onScroll: (e) => {
			const raw = Math.round(e.nativeEvent.contentOffset.x / RULER_GAP);
			const i = Math.min(count - 1, Math.max(0, raw));
			if (i === last.current) return;
			last.current = i;
			onChange(Math.round((min + i * step) * 10) / 10);
			if (!IS_WEB) void Haptics.selectionAsync().catch(() => undefined);
		},
	};
};
