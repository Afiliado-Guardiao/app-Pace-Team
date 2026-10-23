import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { Avatar } from "../Avatar";

import { createAvatarStackStyles } from "./styles";
import { IAvatarStackProps } from "./types";

const DEFAULT_MAX = 4;
const DEFAULT_SIZE = 32;

// Avatares sobrepostos + círculo laranja "N+" (motivo "time / entrou hoje").
export const AvatarStack: React.FC<IAvatarStackProps> = ({
	people = [],
	max = DEFAULT_MAX,
	size = DEFAULT_SIZE,
	extra,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createAvatarStackStyles(theme, size);
	const shown = people.slice(0, max);
	const rest = extra ?? Math.max(0, people.length - max);

	return (
		<View style={[styles.root, style]}>
			{shown.map((person, index) => (
				<View key={index} style={[styles.item, index === 0 && styles.first]}>
					<Avatar name={person.name} src={person.src} size={size} />
				</View>
			))}
			{rest > 0 ? (
				<View style={styles.rest}>
					<Text style={styles.restText}>{rest}+</Text>
				</View>
			) : null}
		</View>
	);
};

export * from "./types";
