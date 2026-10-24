import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GestureResponderHandlers, PanResponder } from "react-native";

import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { STACK } from "../constants";

export type IStackCardId = "run" | "virada";
export type IStackPhase = "idle" | "out" | "in";

interface IUseHomeStackOptions {
	onOpen: (id: IStackCardId) => void;
}

interface IUseHomeStackReturn {
	front: IStackCardId;
	phase: IStackPhase;
	isFresh: boolean;
	shakeKey: number;
	handlersFor: (id: IStackCardId) => GestureResponderHandlers;
}

// Uma vez por sessão a prévia simula a notificação da virada concluída (o app
// real mostra o placar de verdade, sem simulação).
let notifiedThisSession = false;

// Dois cards sobrepostos: arrastar para o lado (ou tocar no de trás) troca a
// ordem; tocar no da frente abre. A virada nova faz o card tremer.
export const useHomeStack = ({ onOpen }: IUseHomeStackOptions): IUseHomeStackReturn => {
	const setViradaState = useStore((state) => state.setViradaState);
	const [front, setFront] = useState<IStackCardId>("run");
	const [phase, setPhase] = useState<IStackPhase>("idle");
	const [isFresh, setIsFresh] = useState(false);
	const [shakeKey, setShakeKey] = useState(0);
	const phaseRef = useRef<IStackPhase>("idle");

	const swap = useCallback(() => {
		if (phaseRef.current !== "idle") return;
		phaseRef.current = "out";
		setPhase("out");
		setTimeout(() => {
			setFront((current) => (current === "run" ? "virada" : "run"));
			phaseRef.current = "in";
			setPhase("in");
		}, STACK.outMs);
		setTimeout(() => {
			phaseRef.current = "idle";
			setPhase("idle");
		}, STACK.idleMs);
	}, []);

	useEffect(() => {
		if (!IS_PREVIEW || notifiedThisSession) return;
		const timer = setTimeout(() => {
			notifiedThisSession = true;
			setViradaState("done");
			setIsFresh(true);
		}, STACK.freshDelay);
		return () => {
			clearTimeout(timer);
		};
	}, [setViradaState]);

	useEffect(() => {
		if (!isFresh) return;
		setShakeKey((key) => key + 1);
		const id = setInterval(() => {
			setShakeKey((key) => key + 1);
		}, STACK.shakeEvery);
		return () => {
			clearInterval(id);
		};
	}, [isFresh]);

	const open = useCallback(
		(id: IStackCardId) => {
			if (id === "virada") setIsFresh(false);
			onOpen(id);
		},
		[onOpen],
	);

	const responders = useMemo(() => {
		const make = (id: IStackCardId) =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onPanResponderRelease: (_, g) => {
					if (Math.abs(g.dx) > STACK.swipe && Math.abs(g.dx) > Math.abs(g.dy)) {
						swap();
						return;
					}
					if (Math.abs(g.dx) < STACK.tap && Math.abs(g.dy) < STACK.tap) {
						if (id === front) open(id);
						else swap();
					}
				},
			});
		return { run: make("run"), virada: make("virada") };
	}, [front, open, swap]);

	const handlersFor = useCallback((id: IStackCardId) => responders[id].panHandlers, [responders]);

	return { front, phase, isFresh, shakeKey, handlersFor };
};
