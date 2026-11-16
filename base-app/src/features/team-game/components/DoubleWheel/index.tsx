import React from "react";
import { Image, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";
import { ITeamGameCell } from "@/lib/supabase";

import budSymbol from "../../../../../assets/brand/symbol.png";
import { useWheelSpin } from "../../hooks/useWheelSpin";

import { ChallengeRing, NameRing } from "./Rings";
import { createDoubleWheelStyles } from "./styles";

interface IDoubleWheelProps {
	size: number;
	cells: ITeamGameCell[];
	names: string[];
	spin: Pick<ReturnType<typeof useWheelSpin>, "outerStyle" | "innerStyle">;
	// Casa e nome que pararam embaixo da seta (null enquanto gira)
	hit: { challenge: number; slot: number } | null;
}

// Roleta dupla: o anel de fora (desafios) e o de dentro (nomes) giram juntos;
// onde a seta parar, aquela pessoa corre aquele km naquele pace
export const DoubleWheel: React.FC<IDoubleWheelProps> = ({ size, cells, names, spin, hit }) => {
	const { theme } = useTheme();
	const styles = createDoubleWheelStyles(theme, size);

	return (
		<View style={styles.root} testID="team-game-wheel" accessibilityRole="image">
			<View style={styles.glow} pointerEvents="none" />
			<Animated.View style={[styles.layer, spin.outerStyle]}>
				<ChallengeRing
					size={size}
					palette={styles.palette}
					hit={hit?.challenge ?? null}
					cells={cells}
				/>
			</Animated.View>
			<Animated.View style={[styles.layer, spin.innerStyle]}>
				<NameRing size={size} palette={styles.palette} hit={hit?.slot ?? null} names={names} />
			</Animated.View>
			<View style={styles.hub}>
				<Image source={budSymbol} style={styles.bud} resizeMode="contain" />
			</View>
			<View style={styles.stick} pointerEvents="none" />
			<View style={styles.pin} pointerEvents="none" />
		</View>
	);
};
