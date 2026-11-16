import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { formatClock, GAME_COPY as C } from "../../constants";
import { useTeamGameScreen } from "../../hooks/useTeamGameScreen";
import { DoubleWheel } from "../DoubleWheel";
import { GameBanner } from "../GameBanner";
import { GamePlayers } from "../GamePlayers";

const createGameStageStyles = (theme: ITheme) => ({
	root: { gap: theme.pace.spacing[4] },
	wait: {
		textAlign: "center" as const,
		fontFamily: theme.pace.typography.fonts.semibold,
		fontSize: theme.pace.typography.sizes.sm,
		color: theme.pace.colors.textAccent,
	},
	rules: {
		textAlign: "center" as const,
		fontFamily: theme.pace.typography.fonts.semibold,
		fontSize: theme.pace.typography.sizes.xs,
		color: theme.pace.colors.textTertiary,
	},
});

interface IGameStageProps {
	s: ReturnType<typeof useTeamGameScreen>;
}

// A roleta rolando: os anéis, o que caiu, o seu desafio e quem já cumpriu
export const GameStage: React.FC<IGameStageProps> = ({ s }) => {
	const { theme } = useTheme();
	const styles = createGameStageStyles(theme);
	const { game, phase, wheel, me } = s;
	if (!game) return null;
	// Só o primeiro nome cabe no anel
	const names = game.players.map((p) => (p.isYou ? "Você" : (p.name.split(" ")[0] ?? p.name)));
	const last = wheel.latest;
	const showFell =
		phase === "spinning" && wheel.hit !== null && last?.km != null && last.pace != null;
	const isMinePending =
		phase === "running" && me?.status === "pending" && me.km != null && me.pace != null;
	const until = game.endsAt ? C.until(formatClock(game.endsAt)) : "";

	return (
		<View style={styles.root}>
			<DoubleWheel
				size={s.wheelSize}
				cells={game.wheel}
				names={names}
				spin={wheel.spin}
				hit={wheel.hit}
			/>
			{showFell ? (
				<GameBanner
					lead={C.fell}
					name={`${last.isYou ? "Você" : last.name} ${C.runs}`}
					task={{ km: last.km ?? 0, pace: last.pace ?? 0 }}
				/>
			) : null}
			{isMinePending ? (
				<GameBanner
					lead={C.mineTitle}
					task={{ km: me.km ?? 0, pace: me.pace ?? 0 }}
					note={`${C.mineHint} ${until}`}
				/>
			) : null}
			{phase === "done" ? (
				<GameBanner
					lead={game.isSuccess ? C.win(game.stakes.win) : C.lose}
					tone={game.isSuccess ? "success" : "danger"}
				/>
			) : null}
			{phase === "spinning" && game.isStarter ? (
				<Button
					fullWidth
					size="lg"
					icon="refresh-cw"
					onPress={s.handleSpin}
					disabled={wheel.isSpinning || s.isBusy}
					testID="team-game-spin"
					accessibilityLabel={C.spin}
				>
					{wheel.isSpinning ? C.spinning : C.spin}
				</Button>
			) : null}
			{phase === "spinning" && !game.isStarter ? (
				<Text style={styles.wait}>{C.waitStarter(game.starterName)}</Text>
			) : null}
			{isMinePending ? (
				<Button
					fullWidth
					size="lg"
					icon="play"
					onPress={s.handleRunMine}
					testID="team-game-run"
					accessibilityLabel={C.runMine}
				>
					{C.runMine}
				</Button>
			) : null}
			<GamePlayers
				players={game.players}
				status={wheel.isSpinning ? "spinning" : game.status}
				hiddenId={wheel.hiddenId}
			/>
			<Text style={styles.rules}>{C.rules(game.stakes.win, game.stakes.lose)}</Text>
			{phase === "spinning" && game.isStarter && !wheel.isSpinning ? (
				<Button
					variant="ghost"
					onPress={s.handleCancel}
					testID="team-game-cancel"
					accessibilityLabel={C.cancel}
				>
					{C.cancel}
				</Button>
			) : null}
			{phase === "done" ? (
				<Button
					fullWidth
					variant="glass"
					onPress={s.handleAgain}
					testID="team-game-again"
					accessibilityLabel={C.again}
				>
					{C.again}
				</Button>
			) : null}
		</View>
	);
};
