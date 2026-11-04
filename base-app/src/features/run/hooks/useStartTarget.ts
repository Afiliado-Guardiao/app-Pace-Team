import { useRef } from "react";
import { View } from "react-native";

import { useBuddyLive } from "@/lib/buddy/liveStore";

interface IUseStartTargetReturn {
	ref: React.RefObject<View | null>;
	onLayout: () => void;
}

// Avisa onde o INICIAR está na tela: o Buddy vivo voa até ele e aperta
export const useStartTarget = (): IUseStartTargetReturn => {
	const ref = useRef<View | null>(null);
	return {
		ref,
		onLayout: () => {
			ref.current?.measureInWindow((x, y, w, h) => {
				useBuddyLive.getState().setStartTarget({ x: x + w / 2, y: y + h / 2 });
			});
		},
	};
};
