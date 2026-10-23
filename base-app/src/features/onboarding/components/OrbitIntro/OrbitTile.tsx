import React from "react";
import { Image, ImageSourcePropType } from "react-native";

import Animated, { SharedValue } from "react-native-reanimated";

import { GlassSurface } from "@/components/pace";
import { useTheme } from "@/theme";

import { ORBIT } from "../../constants";
import { useOrbitTileStyle } from "../../hooks/useOrbitTileStyle";

import { createOrbitTileStyles } from "./styles";

interface IOrbitTileProps {
	time: SharedValue<number>;
	index: number;
	center: { x: number; y: number };
	photo: ImageSourcePropType;
}

// Uma foto quadrada de vidro (cantos 20) girando em volta do ícone.
export const OrbitTile: React.FC<IOrbitTileProps> = ({ time, index, center, photo }) => {
	const { theme } = useTheme();
	const motion = useOrbitTileStyle(time, index, center);
	const styles = createOrbitTileStyles(theme);

	return (
		<Animated.View style={[styles.tile, motion]}>
			<GlassSurface
				appearance={styles.appearance}
				radius={ORBIT.tileRadius}
				style={styles.box}
				backdrop={() => <Image source={photo} style={styles.image} />}
			/>
		</Animated.View>
	);
};
