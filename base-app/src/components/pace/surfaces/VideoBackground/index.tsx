import React from "react";
import { StyleSheet, View } from "react-native";

import { useVideoPlayer, VideoSource, VideoView } from "expo-video";

import { useTheme } from "@/theme";
import { IPaceGradientName } from "@/theme";

import { useLayoutSize } from "../../hooks";
import { GradientLayers } from "../../primitives";

import { useVideoReady } from "./hooks/useVideoReady";

interface IVideoBackgroundProps {
	source: VideoSource;
	// Véu sobre o vídeo (gradiente do tema)
	scrim: IPaceGradientName;
	// Chamado quando o vídeo já pode tocar
	onReady?: () => void;
}

// Vídeo de fundo em tela cheia, mudo e em loop (abertura e boas-vindas).
export const VideoBackground: React.FC<IVideoBackgroundProps> = ({ source, scrim, onReady }) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const player = useVideoPlayer(source, (instance) => {
		instance.loop = true;
		instance.muted = true;
		instance.play();
	});
	useVideoReady(player, onReady);

	return (
		<View
			style={[StyleSheet.absoluteFill, { backgroundColor: theme.pace.colors.bgVideo }]}
			onLayout={onLayout}
			pointerEvents="none"
		>
			<VideoView
				player={player}
				style={StyleSheet.absoluteFill}
				contentFit="cover"
				nativeControls={false}
				allowsPictureInPicture={false}
			/>
			{size ? (
				<GradientLayers
					layers={theme.pace.gradients[scrim]}
					width={size.width}
					height={size.height}
				/>
			) : null}
		</View>
	);
};
