import React from "react";
import { StyleSheet, View } from "react-native";

import { VideoSource } from "expo-video";

import { IPaceGradientName, useTheme } from "@/theme";

import { useLayoutSize } from "../../hooks";
import { GradientLayers } from "../../primitives";

import { useVideoBlob } from "./hooks/useVideoBlob";
import { useWebVideo } from "./hooks/useWebVideo";

interface IVideoBackgroundProps {
	source: VideoSource;
	scrim: IPaceGradientName;
	onReady?: () => void;
}

// O <video> nativo precisa de cobrir a tela inteira por trás do véu
const VIDEO_STYLE: React.CSSProperties = {
	position: "absolute",
	inset: 0,
	width: "100%",
	height: "100%",
	objectFit: "cover",
	pointerEvents: "none",
};

const uriOf = (source: VideoSource): string | undefined => {
	if (typeof source === "string") return source;
	if (source && typeof source === "object" && "uri" in source) return source.uri ?? undefined;
	return undefined;
};

// Versão web (prévia por link): <video> do navegador mudo, em loop e
// "playsInline", que é o que o Safari do iPhone exige para tocar sozinho.
export const VideoBackground: React.FC<IVideoBackgroundProps> = ({ source, scrim, onReady }) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const videoRef = useWebVideo(onReady);
	const video = useVideoBlob(uriOf(source));

	return (
		<View
			style={[StyleSheet.absoluteFill, { backgroundColor: theme.pace.colors.bgVideo }]}
			onLayout={onLayout}
			pointerEvents="none"
		>
			<video
				ref={videoRef}
				src={video.src}
				onError={video.onError}
				style={VIDEO_STYLE}
				autoPlay
				muted
				loop
				playsInline
				preload="auto"
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
