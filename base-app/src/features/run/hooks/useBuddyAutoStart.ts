import { useEffect, useRef, useState } from "react";

import { useBuddyLive } from "@/lib/buddy/liveStore";

import type { IGpsState } from "./useRunSetup";

// O Buddy vivo "apertou" o INICIAR: começa a corrida (se o GPS ainda está
// procurando, começa assim que achar)
export const useBuddyAutoStart = (gps: IGpsState, start: () => void): void => {
	const signal = useBuddyLive((s) => s.startSignal);
	const seen = useRef(signal);
	const [isWaiting, setIsWaiting] = useState(false);

	useEffect(() => {
		if (signal === seen.current) return;
		seen.current = signal;
		setIsWaiting(true);
	}, [signal]);

	useEffect(() => {
		if (!isWaiting || gps === "searching") return;
		setIsWaiting(false);
		start();
	}, [isWaiting, gps, start]);
};
