import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, GlassCard, IconButton } from "@/components/pace";
import { useTheme } from "@/theme";

import { BuddyFigure } from "../BuddyFigure";

import { useBuddyLivePanel } from "./hooks/useBuddyLivePanel";
import { createBuddyLivePanelStyles } from "./styles";

const COPY = {
	solo: "Correr sozinho",
	team: "Com a equipe",
	less: "Diminuir a meta",
	more: "Aumentar a meta",
	later: "Agora não",
	buddy: "Tocar no Buddy",
} as const;

// Buddy vivo por cima da tela: aparece quando o atleta chama o Pace Buddy
// (Toque Traseiro) com o app aberto. Mesmos botões do cartão do iPhone.
export const BuddyLivePanel: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const panel = useBuddyLivePanel();
	const styles = createBuddyLivePanelStyles(theme, insets.bottom);

	return (
		<Modal visible={panel.isOpen} transparent animationType="fade" onRequestClose={panel.dismiss}>
			<View style={styles.backdrop} onTouchStart={panel.onTouch} onTouchMove={panel.onTouch}>
				<GlassCard padding={18}>
					<View style={styles.sheet}>
						<Pressable
							ref={panel.figureRef}
							onLayout={panel.onFigureLayout}
							onPress={panel.tapBuddy}
							style={styles.figure}
							accessibilityRole="button"
							accessibilityLabel={COPY.buddy}
							testID="buddy-live-figure"
						>
							<BuddyFigure
								pose={panel.pose}
								color={panel.look.color}
								accessories={panel.look.accessories}
							/>
						</Pressable>
						<Text style={styles.title}>{panel.speech.title}</Text>
						<Text style={styles.subtitle}>{panel.speech.subtitle}</Text>
						<View style={styles.goal}>
							<IconButton
								icon="chevron-left"
								label={COPY.less}
								onPress={panel.less}
								testID="buddy-live-less"
							/>
							<Text style={styles.goalValue}>{`${String(panel.km)} km`}</Text>
							<IconButton
								icon="chevron-right"
								label={COPY.more}
								onPress={panel.more}
								testID="buddy-live-more"
							/>
						</View>
						<View style={styles.row}>
							<Button
								icon="footprints"
								style={styles.action}
								onPress={panel.runSolo}
								testID="buddy-live-solo"
							>
								{COPY.solo}
							</Button>
							{panel.hasTeam ? (
								<Button
									variant="glass"
									icon="users"
									style={styles.action}
									onPress={panel.runTeam}
									testID="buddy-live-team"
								>
									{COPY.team}
								</Button>
							) : null}
						</View>
						<Button variant="ghost" onPress={panel.dismiss} testID="buddy-live-later">
							{COPY.later}
						</Button>
					</View>
				</GlassCard>
			</View>
		</Modal>
	);
};
