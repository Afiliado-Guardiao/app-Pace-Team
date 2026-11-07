import React from "react";
import { Image, Modal, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Button, IconButton } from "@/components/pace";
import { useTheme } from "@/theme";

import { PRIZE_COPY } from "./constants";
import { usePrizeViewer } from "./hooks/usePrizeViewer";
import { PrizeRays } from "./PrizeRays";
import { createPrizeLayerStyles } from "./styles";

const ART = 280;

// Prêmio em tela cheia: grande, com raios de luz, inclinando com o dedo,
// nome, como conquistar e se já foi conquistado
export const PrizeViewer: React.FC = () => {
	const { theme } = useTheme();
	const view = usePrizeViewer();
	const styles = createPrizeLayerStyles(theme);
	const prize = view.prize;

	return (
		<Modal
			visible={Boolean(prize)}
			transparent
			animationType="fade"
			onRequestClose={view.close}
			statusBarTranslucent
		>
			{prize ? (
				<View style={styles.backdrop}>
					<View ref={view.ref} collapsable={false} style={styles.card}>
						<View style={styles.stage} {...view.pan.panHandlers}>
							{view.isUnlocked ? <PrizeRays size={ART * 1.6} /> : null}
							<Animated.View style={view.tiltStyle}>
								<Image
									source={view.isUnlocked ? prize.image : prize.locked}
									style={{ width: ART, height: ART }}
									resizeMode="contain"
									accessibilityLabel={prize.title}
								/>
							</Animated.View>
						</View>
						<Text style={styles.kicker}>
							{prize.kind === "team" ? PRIZE_COPY.team : PRIZE_COPY.medal}
						</Text>
						<Text style={styles.title}>{prize.title}</Text>
						<Text style={styles.rule}>{prize.rule}</Text>
						<View style={[styles.chip, view.isUnlocked ? styles.chipOn : styles.chipOff]}>
							<Text style={[styles.chipText, view.isUnlocked ? styles.chipTextOn : null]}>
								{view.isUnlocked ? `✓ ${PRIZE_COPY.unlocked}` : `🔒 ${PRIZE_COPY.lockedHint}`}
							</Text>
						</View>
					</View>
					<View style={styles.actions}>
						{view.isUnlocked ? (
							<Button fullWidth onPress={view.share} testID="prize-share">
								{PRIZE_COPY.share}
							</Button>
						) : null}
					</View>
					<View style={styles.close}>
						<IconButton
							icon="x"
							label={PRIZE_COPY.closeLabel}
							onPress={view.close}
							testID="prize-close"
						/>
					</View>
				</View>
			) : null}
		</Modal>
	);
};
