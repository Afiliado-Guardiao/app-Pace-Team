import { useEffect } from "react";
import { useWindowDimensions } from "react-native";

import * as Haptics from "expo-haptics";

import {
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { BUDDY_H, BUDDY_W } from "@/components/buddy/BuddyFigure";
import { IBuddyAccessoryId, IBuddyColorId } from "@/lib/buddy/constants";
import { useBuddyLive } from "@/lib/buddy/liveStore";
import { useBuddyLook } from "@/lib/buddy/useBuddyLook";

// Espera a tela Correr aparecer e dizer onde está o INICIAR
const WAIT_MS = 380;
const FLY_MS = 720;
// Pulo para cima antes de descer no botão (em px)
const HOP = 70;
// Tamanho do Buddy quando "entra" no botão
const SMALL = 0.32;
const RING_MS = 480;
const FADE_MS = 260;

interface IUseBuddyFlightReturn {
	isFlying: boolean;
	color: IBuddyColorId;
	accessories: IBuddyAccessoryId[];
	buddyStyle: ReturnType<typeof useAnimatedStyle>;
	ringStyle: ReturnType<typeof useAnimatedStyle>;
}

// Correr pelo Buddy vivo: ele sai do painel, encolhe, voa até o INICIAR da
// tela Correr e "aperta" o botão (a corrida começa sozinha). Com "reduzir
// movimento" ligado, só aperta.
export const useBuddyFlight = (): IUseBuddyFlightReturn => {
	const flight = useBuddyLive((s) => s.flight);
	const look = useBuddyLook();
	const isReduced = useReducedMotion();
	const { width, height } = useWindowDimensions();
	const x = useSharedValue(0);
	const y = useSharedValue(0);
	const scale = useSharedValue(1);
	const opacity = useSharedValue(0);
	const ringX = useSharedValue(0);
	const ringY = useSharedValue(0);
	const ring = useSharedValue(0);

	useEffect(() => {
		if (!flight) return undefined;
		const timers: ReturnType<typeof setTimeout>[] = [];
		x.value = flight.from.x - BUDDY_W / 2;
		y.value = flight.from.y - BUDDY_H / 2;
		scale.value = 1;
		opacity.value = isReduced ? 0 : 1;
		ring.value = 0;

		const press = (): void => {
			useBuddyLive.getState().pressStart();
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			ring.value = withTiming(1, { duration: RING_MS });
			opacity.value = withTiming(0, { duration: FADE_MS });
			timers.push(
				setTimeout(() => {
					useBuddyLive.getState().endFlight();
				}, RING_MS),
			);
		};
		const fly = (): void => {
			const target = useBuddyLive.getState().startTarget ?? { x: width / 2, y: height * 0.8 };
			ringX.value = target.x;
			ringY.value = target.y;
			if (isReduced) {
				press();
				return;
			}
			const ease = Easing.inOut(Easing.cubic);
			x.value = withTiming(target.x - BUDDY_W / 2, { duration: FLY_MS, easing: ease });
			y.value = withSequence(
				withTiming(y.value - HOP, { duration: FLY_MS * 0.35, easing: Easing.out(Easing.quad) }),
				withTiming(target.y - BUDDY_H / 2, {
					duration: FLY_MS * 0.65,
					easing: Easing.in(Easing.quad),
				}),
			);
			scale.value = withTiming(SMALL, { duration: FLY_MS, easing: ease });
			timers.push(setTimeout(press, FLY_MS));
		};
		timers.push(setTimeout(fly, WAIT_MS));
		return () => {
			timers.forEach(clearTimeout);
		};
	}, [flight, isReduced, width, height, x, y, scale, opacity, ring, ringX, ringY]);

	const buddyStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
	}));
	// Anel que "estoura" no botão quando ele aperta
	const ringStyle = useAnimatedStyle(() => ({
		opacity: ring.value > 0 ? 1 - ring.value : 0,
		transform: [
			{ translateX: ringX.value },
			{ translateY: ringY.value },
			{ scale: 1 + ring.value * 0.7 },
		],
	}));

	return {
		isFlying: flight !== null,
		color: look.color,
		accessories: look.accessories,
		buddyStyle,
		ringStyle,
	};
};
