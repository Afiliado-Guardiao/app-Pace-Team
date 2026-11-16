import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";
import { ITeamGamePlayer, ITeamGameStatus } from "@/lib/supabase";

import { formatPace, GAME_COPY as C } from "../../constants";

const AV = 34;

const createGamePlayersStyles = (theme: ITheme) => {
	const { colors, typography, spacing, radii } = theme.pace;
	return {
		list: { gap: spacing[2] },
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[2.5],
			paddingVertical: spacing[2.5],
			paddingHorizontal: spacing[3],
			borderRadius: radii.md,
			borderWidth: 1,
			borderColor: colors.hairline,
			backgroundColor: colors.glass1,
		},
		av: {
			width: AV,
			height: AV,
			borderRadius: AV / 2,
			backgroundColor: colors.bgElevated,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		initial: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
		},
		texts: { flex: 1, gap: 2 },
		badge: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.micro,
			letterSpacing: 0.3,
		},
		name: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		task: {
			fontFamily: typography.numericFonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		points: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			minWidth: 40,
			textAlign: "right" as const,
		},
		pending: { color: colors.textAccent },
		waiting: { color: colors.textDisabled },
		drawn: { color: colors.textSecondary },
		done: { color: colors.statusSuccess },
		failed: { color: colors.statusDanger },
		doneRow: { borderColor: colors.statusSuccess, backgroundColor: colors.statusSuccessSoft },
		failedRow: { borderColor: colors.statusDanger, backgroundColor: colors.statusDangerSoft },
	};
};

type IStatusKey = "pending" | "waiting" | "drawn" | "done" | "failed";

const statusOf = (p: ITeamGamePlayer, game: ITeamGameStatus, isHidden: boolean): IStatusKey => {
	if (p.challenge === null || isHidden) return "waiting";
	if (game === "spinning") return "drawn";
	return p.status;
};

const LABELS: Record<IStatusKey, string> = {
	pending: C.statusPending,
	waiting: C.statusWaiting,
	drawn: C.statusDrawn,
	done: C.statusDone,
	failed: C.statusFailed,
};

const taskOf = (p: ITeamGamePlayer, isHidden: boolean): string =>
	!isHidden && p.km !== null && p.pace !== null ? `${String(p.km)} km · ${formatPace(p.pace)}` : "";

const pointsOf = (p: ITeamGamePlayer): string => {
	if (!p.points) return "";
	return `${p.points > 0 ? "+" : "−"}${String(Math.abs(p.points))} pts`;
};

interface IGamePlayersProps {
	players: ITeamGamePlayer[];
	status: ITeamGameStatus;
	// Sorteado agora, com a roleta ainda girando: o desafio fica escondido
	hiddenId: string | null;
}

// Quem está na roleta, o desafio de cada um e, em cima do nome, se concluiu
// ou não (a equipe vê e pode cobrar)
export const GamePlayers: React.FC<IGamePlayersProps> = ({ players, status, hiddenId }) => {
	const { theme } = useTheme();
	const styles = createGamePlayersStyles(theme);

	return (
		<View style={styles.list}>
			{players.map((p) => {
				const isHidden = p.userId === hiddenId;
				const key = statusOf(p, status, isHidden);
				const rowTone = key === "done" ? styles.doneRow : null;
				return (
					<View
						key={p.userId}
						style={[styles.row, key === "failed" ? styles.failedRow : rowTone]}
						testID={`team-game-player-${key}`}
					>
						<View style={styles.av}>
							<Text style={styles.initial}>{p.name.charAt(0).toUpperCase()}</Text>
						</View>
						<View style={styles.texts}>
							<Text style={[styles.badge, styles[key]]}>{LABELS[key]}</Text>
							<Text style={styles.name} numberOfLines={1}>
								{p.isYou ? `${p.name} (você)` : p.name}
							</Text>
							<Text style={styles.task}>{taskOf(p, isHidden)}</Text>
						</View>
						<Text style={[styles.points, styles[key]]}>{pointsOf(p)}</Text>
					</View>
				);
			})}
		</View>
	);
};
