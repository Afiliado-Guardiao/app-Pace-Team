import React from "react";
import { Image, Pressable, View } from "react-native";

import { useTheme } from "@/theme";
import { IPrizeId, PRIZE_ART, PRIZES } from "@/lib/prizes";

import { createPrizeIconStyles } from "./styles";

interface IPrizeIconProps {
	id: IPrizeId;
	size: number;
	// Ainda não conquistado: apagado, com o cadeado de prata no canto
	isLocked?: boolean;
	onPress?: () => void;
	testID?: string;
}

// Prêmio 3D (medalha ou conquista da equipe). Tocar abre em tela cheia.
export const PrizeIcon: React.FC<IPrizeIconProps> = ({
	id,
	size,
	isLocked = false,
	onPress,
	testID,
}) => {
	const { theme } = useTheme();
	const prize = PRIZES[id];
	const styles = createPrizeIconStyles(theme, size);

	return (
		<Pressable
			onPress={onPress}
			disabled={!onPress}
			accessibilityRole={onPress ? "button" : "image"}
			accessibilityLabel={`${prize.title}${isLocked ? ", bloqueada" : ""}`}
			testID={testID ?? `prize-${id}`}
			style={styles.root}
		>
			<Image
				source={isLocked ? prize.locked : prize.image}
				style={styles.image}
				resizeMode="contain"
			/>
			{isLocked ? (
				<View style={styles.lockBadge}>
					<Image source={PRIZE_ART.lock} style={styles.lock} resizeMode="contain" />
				</View>
			) : null}
		</Pressable>
	);
};
