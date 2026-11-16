import React from "react";
import { Text, View } from "react-native";

import { Button, FloatingToast, ScreenScroll, TopBar } from "@/components/pace";
import { useTheme } from "@/theme";

import { GameStage } from "./components/GameStage";
import { LevelPicker } from "./components/LevelPicker";
import { GAME_COPY as C } from "./constants";
import { useTeamGameScreen } from "./hooks/useTeamGameScreen";
import { createTeamGameStyles } from "./styles";

// Jogar com a equipe: a roleta dupla (nomes + desafios) com quem está online
export const TeamGameScreen: React.FC = () => {
	const { theme } = useTheme();
	const styles = createTeamGameStyles(theme);
	const s = useTeamGameScreen();
	const isLobby = s.phase === "lobby";
	const hasMates = s.mates.length > 0;

	return (
		<View style={styles.root}>
			<ScreenScroll bottom={40} testID="team-game-scroll">
				<TopBar title={C.title} onBack={s.goBack} />
				<Text style={styles.sub}>{C.sub}</Text>
				{isLobby ? (
					<View style={styles.body}>
						<View style={styles.block}>
							<Text style={styles.section}>{C.onlineTitle}</Text>
							<View style={styles.chips}>
								<Text style={styles.chip}>Você</Text>
								{s.mates.map((m) => (
									<Text key={m.id} style={styles.chip}>
										{m.name}
									</Text>
								))}
							</View>
							{hasMates ? null : <Text style={styles.note}>{C.onlineNone}</Text>}
						</View>
						<View style={styles.block}>
							<Text style={styles.section}>{C.levelTitle}</Text>
							<LevelPicker level={s.level} onChange={s.setLevel} />
						</View>
						<Button
							fullWidth
							size="lg"
							icon="disc-3"
							onPress={s.handleCall}
							disabled={!hasMates || s.isBusy}
							testID="team-game-call"
							accessibilityLabel={C.call}
						>
							{C.call}
						</Button>
					</View>
				) : (
					<GameStage s={s} />
				)}
			</ScreenScroll>
			<FloatingToast toast={s.toast} />
		</View>
	);
};
