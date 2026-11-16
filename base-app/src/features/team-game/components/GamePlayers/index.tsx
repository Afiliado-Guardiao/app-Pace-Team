import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";
import { ITeamGamePlayer, ITeamGameStatus } from "@/lib/supabase";

import { formatPace, GAME_COPY as C } from "../../constants";

const AV = 30;

const createGamePlayersStyles = (theme: ITheme) => {
	const { colors, typography, spacing, radii } = theme.pace;
	return {
		list: { gap: spacing[2] },
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[2.5],
			paddingVertical: spacing[2],
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
		name: {
			flex: 1,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		task: {
			fontFamily: typography.numericFonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		status: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			minWidth: 64,
			textAlign: "right" as const,
		},
		pending: { color: colors.textAccent },
		waiting: { color: colors.textDisabled },
		done: { color: colors.statusSuccess },
		failed: { color: colors.statusDanger },
	};
};

type IStatusKey = "pending" | "waiting" | "done" | "failed";

const statusOf = (p: ITeamGamePlayer, game: ITeamGameStatus): IStatusKey => {
	if (p.challenge === null) return "waiting";
	if (game === "spinning") return "waiting";
	return p.status;
};

const LABELS: Record<IStatusKey, string> = {
	pending: C.statusPending,
	waiting: C.statusWaiting,
	done: C.statusDone,
	failed: C.statusFailed,
};

interface IGamePlayersProps {
	players: ITeamGamePlayer[];
	status: ITeamGameStatus;
}

// Quem está na roleta, o desafio de cada um e se já cumpriu
export const GamePlayers: React.FC<IGamePlayersProps> = ({ players, status }) => {
	const { theme } = useTheme();
	const styles = createGamePlayersStyles(theme);

	return (
		<View style={styles.list}>
			{players.map((p) => {
				const key = statusOf(p, status);
				const task =
					p.km !== null && p.pace !== null ? `${String(p.km)} km · ${formatPace(p.pace)}` : "";
				const points = p.points ? ` ${p.points > 0 ? "+" : "−"}${String(Math.abs(p.points))}` : "";
				return (
					<View key={p.userId} style={styles.row}>
						<View style={styles.av}>
							<Text style={styles.initial}>{p.name.charAt(0).toUpperCase()}</Text>
						</View>
						<Text style={styles.name} numberOfLines={1}>
							{p.isYou ? `${p.name} (você)` : p.name}
						</Text>
						<Text style={styles.task}>{task}</Text>
						<Text style={[styles.status, styles[key]]}>{`${LABELS[key]}${points}`}</Text>
					</View>
				);
			})}
		</View>
	);
};
