import React from "react";
import { Image, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { GradientLayers } from "../../primitives";
import { initialsOf } from "../../utils";

import { createAvatarStyles } from "./styles";
import { IAvatarProps } from "./types";

const DEFAULT_SIZE = 40;

// Foto redonda (ou quadrada com cantos suaves) com anel branco; sem foto,
// mostra as iniciais sobre o gradiente ardósia. ring = anel laranja.
export const Avatar: React.FC<IAvatarProps> = ({
	src,
	name = "",
	size = DEFAULT_SIZE,
	ring = false,
	square = false,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createAvatarStyles(theme, size, { ring, square });
	const source = typeof src === "string" ? { uri: src } : src;

	return (
		<View style={[styles.root, style]} accessibilityLabel={name || undefined}>
			<View style={styles.clip}>
				<GradientLayers layers={theme.pace.gradients.avatar} width={size} height={size} />
				{source ? (
					<Image source={source} style={styles.image} accessibilityIgnoresInvertColors />
				) : (
					<Text style={styles.initials}>{initialsOf(name)}</Text>
				)}
			</View>
		</View>
	);
};

export * from "./types";
