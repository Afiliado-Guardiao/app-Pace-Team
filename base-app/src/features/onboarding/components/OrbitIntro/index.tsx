import React from "react";
import { Image, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { GlassSurface, GradientLayers, Highlight, useLayoutSize } from "@/components/pace";
import { useTheme } from "@/theme";
import { CREW } from "@/lib/pace";

import { APP_ICON_TILE, ONBOARDING_COPY, ORBIT } from "../../constants";
import { useOrbitCaptionStyle } from "../../hooks/useOrbitCaptionStyle";
import { useOrbitClock } from "../../hooks/useOrbitClock";
import { useOrbitIconStyle } from "../../hooks/useOrbitIconStyle";
import { useOrbitRingStyle } from "../../hooks/useOrbitRingStyle";

import { OrbitTile } from "./OrbitTile";
import { createOrbitStyles } from "./styles";

interface IOrbitIntroProps {
	onDone: () => void;
}

// Último passo da apresentação: as fotos da galera chegam, orbitam o ícone
// do app, são sugadas para dentro dele e o app abre.
export const OrbitIntro: React.FC<IOrbitIntroProps> = ({ onDone }) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const time = useOrbitClock(onDone);
	const ringStyle = useOrbitRingStyle(time);
	const iconStyle = useOrbitIconStyle(time);
	const captionStyle = useOrbitCaptionStyle(time);
	const center = { x: (size?.width ?? 0) / 2, y: (size?.height ?? 0) * ORBIT.centerYRatio };
	const styles = createOrbitStyles(theme, center);

	return (
		<View style={styles.root} onLayout={onLayout}>
			{size ? (
				<GradientLayers
					layers={theme.pace.gradients.orbitBg}
					width={size.width}
					height={size.height}
				/>
			) : null}
			{size ? (
				<>
					{styles.rings.map((ring, index) => (
						<Animated.View key={index} style={[ring.position, ringStyle]}>
							<GlassSurface appearance={ring.appearance} radius={ring.radius} style={ring.size} />
						</Animated.View>
					))}
					{CREW.map((photo, index) => (
						<OrbitTile key={index} time={time} index={index} center={center} photo={photo} />
					))}
					<Animated.View style={[styles.icon, iconStyle]}>
						<GlassSurface
							appearance={styles.iconAppearance}
							radius={ORBIT.iconRadius}
							style={styles.iconBox}
							backdrop={() => <Image source={APP_ICON_TILE} style={styles.iconImage} />}
						/>
					</Animated.View>
					<Animated.View style={[styles.caption, captionStyle]}>
						<Text style={styles.captionText}>
							{ONBOARDING_COPY.orbitText} <Highlight>{ONBOARDING_COPY.orbitHighlight}</Highlight>
						</Text>
						<Text style={styles.brand}>{ONBOARDING_COPY.brand}</Text>
					</Animated.View>
				</>
			) : null}
		</View>
	);
};
