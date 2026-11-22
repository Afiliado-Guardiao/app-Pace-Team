import React from "react";
import { ScrollView, Text, View } from "react-native";

import { Button, Sheet } from "@/components/pace";
import { useTheme } from "@/theme";
import { ITeamGame } from "@/lib/supabase";

import { resultRows } from "./rows";
import { createTeamGameResultStyles } from "./styles";

interface IResultSheetProps {
	game: ITeamGame;
	onClose: () => void;
}

const COPY = {
	title: "Resultado da roleta",
	win: (pts: number) => `Todos cumpriram! +${String(pts)} pontos para cada um.`,
	lose: (pts: number) => `Nem todos cumpriram. Quem não cumpriu perdeu ${String(pts)} pontos.`,
	done: "✓ Concluiu",
	failed: "✕ Não concluiu",
	goal: "Desafio",
	ran: "Correu",
	ok: "Entendi",
} as const;

// Quem concluiu, quem não concluiu, o desafio de cada um e o que cada um fez
export const ResultSheet: React.FC<IResultSheetProps> = ({ game, onClose }) => {
	const { theme } = useTheme();
	const styles = createTeamGameResultStyles(theme);
	const summary = game.isSuccess ? COPY.win(game.stakes.win) : COPY.lose(game.stakes.lose);

	return (
		<Sheet
			title={COPY.title}
			onClose={onClose}
			testID="team-game-result"
			actions={
				<Button fullWidth onPress={onClose} testID="team-game-result-ok">
					{COPY.ok}
				</Button>
			}
		>
			<Text style={styles.summary}>{summary}</Text>
			<ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
				{resultRows(game).map((r) => {
					const tone = r.isDone ? styles.done : styles.failed;
					return (
						<View key={r.id} style={[styles.row, r.isDone ? styles.doneRow : styles.failedRow]}>
							<View style={styles.top}>
								<Text style={styles.name} numberOfLines={1}>
									{r.name}
								</Text>
								<Text style={[styles.points, tone]}>{r.points}</Text>
							</View>
							<Text style={[styles.status, tone]}>{r.isDone ? COPY.done : COPY.failed}</Text>
							<View style={styles.line}>
								<Text style={styles.label}>{COPY.goal}</Text>
								<Text style={styles.value}>{r.goal}</Text>
							</View>
							{r.ran ? (
								<View style={styles.line}>
									<Text style={styles.label}>{COPY.ran}</Text>
									<Text style={styles.value}>{r.ran}</Text>
								</View>
							) : null}
						</View>
					);
				})}
			</ScrollView>
		</Sheet>
	);
};
