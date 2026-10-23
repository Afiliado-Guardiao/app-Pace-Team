import { useEffect, useMemo, useRef, useState } from "react";
import { GestureResponderHandlers, PanResponder } from "react-native";

import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "@/theme";

import { RAIL_DRAG_THRESHOLD, RAIL_GAP, RAIL_LABEL_HEIGHT } from "../constants";
import { ITabItem } from "../types";

interface IUseSideRailOptions {
	items: readonly ITabItem[];
	active: string;
	size: number;
	onChange?: (id: string) => void;
}

interface IUseSideRailReturn {
	current: number;
	previewLabel: string | null;
	labelTop: number;
	panHandlers: GestureResponderHandlers;
	discStyle: ReturnType<typeof useAnimatedStyle>;
}

// Trilho lateral: toque troca de aba; arrastar na vertical passa pelas abas
// (30px por aba) mostrando o nome, e confirma ao soltar. O disco laranja
// desliza com a mola do design system.
export const useSideRail = ({
	items,
	active,
	size,
	onChange,
}: IUseSideRailOptions): IUseSideRailReturn => {
	const { theme } = useTheme();
	const { motion } = theme.pace;
	const activeIndex = Math.max(
		0,
		items.findIndex((item) => item.id === active),
	);
	const [preview, setPreview] = useState<number | null>(null);
	const previewRef = useRef<number | null>(null);
	const current = preview ?? activeIndex;
	const step = size + RAIL_GAP;
	const discTop = useSharedValue(current * step);

	useEffect(() => {
		discTop.value = withTiming(current * step, {
			duration: motion.durations.rail,
			easing: Easing.bezier(...motion.easings.rail),
		});
	}, [current, step, discTop, motion]);

	const panResponder = useMemo(() => {
		const update = (next: number | null): void => {
			previewRef.current = next;
			setPreview(next);
		};
		return PanResponder.create({
			onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dy) > RAIL_DRAG_THRESHOLD,
			onPanResponderMove: (_, g) => {
				const offset = Math.trunc(g.dy / motion.railDragStep);
				update(Math.max(0, Math.min(items.length - 1, activeIndex + offset)));
			},
			onPanResponderRelease: () => {
				const next = previewRef.current;
				if (next !== null && next !== activeIndex) onChange?.(items[next]?.id ?? active);
				update(null);
			},
			onPanResponderTerminate: () => {
				update(null);
			},
		});
	}, [items, activeIndex, active, onChange, motion.railDragStep]);

	const discStyle = useAnimatedStyle(() => ({ transform: [{ translateY: discTop.value }] }));

	return {
		current,
		previewLabel: preview === null ? null : (items[preview]?.label ?? null),
		labelTop: current * step + size / 2 - RAIL_LABEL_HEIGHT / 2,
		panHandlers: panResponder.panHandlers,
		discStyle,
	};
};
