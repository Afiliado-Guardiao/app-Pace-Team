import { useCallback, useRef } from "react";
import { View } from "react-native";

import * as Sharing from "expo-sharing";

import { captureRef } from "react-native-view-shot";

// Gera a imagem do cartão do prêmio e abre o compartilhar do iPhone
export const usePrizeShare = (): { ref: React.RefObject<View | null>; share: () => void } => {
	const ref = useRef<View>(null);
	const share = useCallback(() => {
		void (async () => {
			if (!ref.current || !(await Sharing.isAvailableAsync())) return;
			try {
				const uri = await captureRef(ref, { format: "png", quality: 1 });
				await Sharing.shareAsync(uri, {
					mimeType: "image/png",
					UTI: "public.png",
					dialogTitle: "PACE TEAM",
				});
			} catch {
				// Cancelou o compartilhar: nada a fazer
			}
		})();
	}, []);
	return { ref, share };
};
