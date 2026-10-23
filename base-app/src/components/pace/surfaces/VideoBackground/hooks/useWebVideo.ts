import { useCallback, useEffect, useRef } from "react";

const HAVE_FUTURE_DATA = 3;

// <video> da web: força mudo (o Safari decide o autoplay por essa
// propriedade), tenta tocar e avisa quando dá para tocar, inclusive quando o
// vídeo já veio do cache e os eventos aconteceram antes de ouvirmos.
export const useWebVideo = (onReady?: () => void): ((el: HTMLVideoElement | null) => void) => {
	const readyRef = useRef(onReady);

	useEffect(() => {
		readyRef.current = onReady;
	}, [onReady]);

	return useCallback((el: HTMLVideoElement | null) => {
		if (!el) return;
		const notify = (): void => {
			readyRef.current?.();
		};
		el.muted = true;
		el.defaultMuted = true;
		el.setAttribute("muted", "");
		el.addEventListener("playing", notify);
		el.addEventListener("canplay", notify);
		if (el.readyState >= HAVE_FUTURE_DATA) notify();
		el.play().catch(() => undefined);
	}, []);
};
