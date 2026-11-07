import React from "react";
import { Image, Modal, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Button, Logo } from "@/components/pace";
import { useTheme } from "@/theme";

import { Confetti } from "../Confetti";

import { PRIZE_COPY } from "./constants";
import { usePrizeCelebration } from "./hooks/usePrizeCelebration";
import { PrizeRays } from "./PrizeRays";
import { createPrizeLayerStyles } from "./styles";

const ART = 270;
const LOGO_H = 34;

// Card comemorativo exclusivo do PACE TEAM quando sai uma conquista nova
export const PrizeCelebration: React.FC = () => {
	const { theme } = useTheme();
	const view = usePrizeCelebration();
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
						<Text style={styles.newTitle}>{PRIZE_COPY.newTitle}</Text>
						<Text style={styles.newSub}>
							{prize.kind === "team" ? PRIZE_COPY.newTeam : PRIZE_COPY.newMedal}
						</Text>
						<View style={styles.stage}>
							<PrizeRays size={ART * 1.7} />
							<Animated.View style={view.popStyle}>
								<Image
									source={prize.image}
									style={{ width: ART, height: ART }}
									resizeMode="contain"
									accessibilityLabel={prize.title}
								/>
							</Animated.View>
						</View>
						<Text style={styles.title}>{prize.title}</Text>
						<Text style={styles.rule}>{prize.rule}</Text>
						<View style={styles.logo}>
							<Logo height={LOGO_H} />
						</View>
					</View>
					<View style={styles.actions}>
						<Button fullWidth onPress={view.share} testID="prize-new-share">
							{PRIZE_COPY.share}
						</Button>
						<Button fullWidth variant="glass" onPress={view.close} testID="prize-new-close">
							{PRIZE_COPY.close}
						</Button>
					</View>
					<View style={styles.confetti} pointerEvents="none">
						<Confetti key={prize.id} height={view.height} />
					</View>
				</View>
			) : null}
		</Modal>
	);
};
