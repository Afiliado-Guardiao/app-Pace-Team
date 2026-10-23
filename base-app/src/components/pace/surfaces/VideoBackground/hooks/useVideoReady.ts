import { useEffect } from "react";

import { VideoPlayer } from "expo-video";

// Avisa quando o vídeo já pode tocar (a abertura só começa a contar aí).
export const useVideoReady = (player: VideoPlayer, onReady?: () => void): void => {
	useEffect(() => {
		if (!onReady) return;
		if (player.status === "readyToPlay") onReady();
		const subscription = player.addListener("statusChange", ({ status }) => {
			if (status === "readyToPlay") onReady();
		});
		return () => {
			subscription.remove();
		};
	}, [player, onReady]);
};
