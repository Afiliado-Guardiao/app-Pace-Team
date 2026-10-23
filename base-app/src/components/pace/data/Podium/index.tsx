import React from "react";
import { View } from "react-native";

import { useTheme } from "@/theme";

import { PODIUM_ORDER } from "./constants";
import { PodiumColumn } from "./PodiumColumn";
import { createPodiumStyles } from "./styles";
import { IPodiumProps } from "./types";

// Pódio dos 3 primeiros (2º · 1º · 3º). Ouro/prata/bronze só aqui.
export const Podium: React.FC<IPodiumProps> = ({ teams, onSelect, style }) => {
	const { theme } = useTheme();
	const styles = createPodiumStyles(theme);

	return (
		<View style={[styles.root, style]}>
			{PODIUM_ORDER.map(({ index, place, flex }) =>
				index < teams.length ? (
					<PodiumColumn
						key={place}
						team={teams[index]}
						place={place}
						flex={flex}
						onSelect={onSelect}
					/>
				) : (
					<View key={place} style={styles.spacer(flex)} />
				),
			)}
		</View>
	);
};

export * from "./types";
