import { useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder, PanResponderInstance } from "react-native";

import * as Haptics from "expo-haptics";

import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface ISwipeOptions {
	// Exclui de verdade; false = a pessoa desistiu (a linha volta)
	onDelete: () => Promise<boolean>;
	isEnabled: boolean;
}

interface IUseSwipeToDeleteReturn {
	panHandlers: PanResponderInstance["panHandlers"];
	rowStyle: ReturnType<typeof useAnimatedStyle>;
	isOpen: boolean;
	onLayout: (event: LayoutChangeEvent) => void;
	close: () => void;
	remove: () => void;
}

// Largura da lixeira que aparece ao arrastar um pouco
export const SWIPE_TRASH_WIDTH = 84;
// Arrastou para o lado (e não para cima): a linha começa a andar
const START_DRAG = 12;
// Arrastou mais que isso da largura: exclui ao soltar
const DELETE_AT = 0.45;
const SLIDE_MS = 180;

// Arrastar para a esquerda: um pouco mostra a lixeira vermelha; arrastando
// mais (quase metade da linha), exclui ao soltar.
export const useSwipeToDelete = ({
	onDelete,
	isEnabled,
}: ISwipeOptions): IUseSwipeToDeleteReturn => {
	const x = useSharedValue(0);
	const width = useRef(0);
	const openRef = useRef(false);
	const armed = useRef(false);
	const options = useRef({ onDelete, isEnabled });
	options.current = { onDelete, isEnabled };
	const [isOpen, setIsOpen] = useState(false);

	const handlers = useMemo(() => {
		const setOpen = (open: boolean): void => {
			openRef.current = open;
			setIsOpen(open);
		};
		const close = (): void => {
			x.value = withTiming(0, { duration: SLIDE_MS });
			setOpen(false);
		};
		const remove = (): void => {
			setOpen(false);
			x.value = withTiming(-width.current, { duration: SLIDE_MS });
			void options.current.onDelete().then((isDeleted) => {
				if (!isDeleted) close();
			});
		};
		const offset = (dx: number): number =>
			Math.min(0, (openRef.current ? -SWIPE_TRASH_WIDTH : 0) + dx);
		const isSideways = (dx: number, dy: number): boolean =>
			options.current.isEnabled && Math.abs(dx) > START_DRAG && Math.abs(dx) > Math.abs(dy) * 1.5;
		// Captura: o arrasto ganha do toque da linha (que abre a corrida)
		const pan = PanResponder.create({
			onMoveShouldSetPanResponder: (_, g) => isSideways(g.dx, g.dy),
			onMoveShouldSetPanResponderCapture: (_, g) => isSideways(g.dx, g.dy),
			onPanResponderTerminationRequest: () => false,
			onPanResponderMove: (_, g) => {
				const next = offset(g.dx);
				x.value = next;
				const isPast = -next > width.current * DELETE_AT;
				if (isPast !== armed.current) {
					armed.current = isPast;
					void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				}
			},
			onPanResponderRelease: (_, g) => {
				const next = offset(g.dx);
				armed.current = false;
				if (-next > width.current * DELETE_AT) {
					remove();
					return;
				}
				if (-next > SWIPE_TRASH_WIDTH / 2) {
					x.value = withTiming(-SWIPE_TRASH_WIDTH, { duration: SLIDE_MS });
					setOpen(true);
					return;
				}
				close();
			},
			onPanResponderTerminate: close,
		});
		return { pan, close, remove };
	}, [x]);

	const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

	return {
		panHandlers: handlers.pan.panHandlers,
		rowStyle,
		isOpen,
		onLayout: (event) => {
			width.current = event.nativeEvent.layout.width;
		},
		close: handlers.close,
		remove: handlers.remove,
	};
};
