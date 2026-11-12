import { useMemo, useState } from "react";
import { GestureResponderHandlers, PanResponder, useWindowDimensions } from "react-native";

import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PRO_FAB_EDGE, PRO_FAB_SIZE } from "../styles";

interface IUseFabDragReturn {
	handlers: GestureResponderHandlers;
	dragStyle: ReturnType<typeof useAnimatedStyle>;
	// Do lado esquerdo o menu abre alinhado à esquerda
	isLeft: boolean;
}

// Só vira arrasto depois de mexer um pouco (o toque continua abrindo o menu)
const SLOP = 6;
const SPRING = { damping: 18, stiffness: 240, mass: 0.6 } as const;
// Não sobe por cima do topo da tela (relógio e notificações)
const TOP_ROOM = 140;

// Botão Pro solto: o atleta arrasta com o dedo para onde quiser e, ao soltar,
// ele gruda na borda mais perto (esquerda ou direita)
export const useFabDrag = (): IUseFabDragReturn => {
	const { width, height } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const x = useSharedValue(0);
	const y = useSharedValue(0);
	const start = useSharedValue({ x: 0, y: 0 });
	const [isLeft, setIsLeft] = useState(false);
	const leftX = -(width - PRO_FAB_SIZE - PRO_FAB_EDGE * 2);
	const topY = -(height - insets.top - insets.bottom - TOP_ROOM);

	const responder = useMemo(
		() =>
			PanResponder.create({
				onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dx) + Math.abs(g.dy) > SLOP,
				onPanResponderGrant: () => {
					start.value = { x: x.value, y: y.value };
				},
				onPanResponderMove: (_e, g) => {
					x.value = start.value.x + g.dx;
					y.value = Math.min(0, Math.max(topY, start.value.y + g.dy));
				},
				onPanResponderRelease: () => {
					const toLeft = x.value < leftX / 2;
					x.value = withSpring(toLeft ? leftX : 0, SPRING);
					setIsLeft(toLeft);
				},
				onPanResponderTerminate: () => {
					x.value = withSpring(isLeft ? leftX : 0, SPRING);
				},
			}),
		[x, y, start, leftX, topY, isLeft],
	);

	const dragStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: x.value }, { translateY: y.value }],
	}));

	return { handlers: responder.panHandlers, dragStyle, isLeft };
};
