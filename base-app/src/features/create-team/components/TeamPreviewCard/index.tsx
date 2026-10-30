import React from "react";
import { Text, View } from "react-native";

import { Avatar, Badge, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { CREATE_TEAM_COPY, JOINED } from "../../constants";

interface ITeamPreviewCardProps {
	name: string;
	city: string;
	size: number;
	// Escudo escolhido (sem ele, a sigla)
	logoUri?: string | null;
}

const createTeamPreviewCardStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12 },
		body: { flex: 1 },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		sub: {
			marginTop: 3,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textSecondary,
		},
		// Equipe grande quebra em mais de uma linha
		slots: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 6, marginTop: 14 },
		slot: {
			flexGrow: 1,
			flexBasis: 10,
			height: 6,
			borderRadius: 3,
			backgroundColor: colors.slotEmpty,
		},
		slotOn: { backgroundColor: colors.orange[500] },
		note: {
			marginTop: 10,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			lineHeight: typography.sizes.label * 1.45,
			color: colors.ink[200],
		},
	};
};

// Prévia do cartão da equipe com as vagas preenchidas.
export const TeamPreviewCard: React.FC<ITeamPreviewCardProps> = ({ name, city, size, logoUri }) => {
	const { theme } = useTheme();
	const styles = createTeamPreviewCardStyles(theme);
	const slots = Array.from({ length: size }, (_, i) => i);

	return (
		<GlassCard variant="accent">
			<View style={styles.row}>
				<Avatar
					name={name || CREATE_TEAM_COPY.fallbackAvatar}
					src={logoUri ?? undefined}
					square
					size={50}
				/>
				<View style={styles.body}>
					<Text style={styles.name}>{name || CREATE_TEAM_COPY.fallbackName}</Text>
					<Text style={styles.sub}>{`${city} · ${String(size)} x ${String(size)}`}</Text>
				</View>
				<Badge tone="warning" dot>
					{CREATE_TEAM_COPY.preparing}
				</Badge>
			</View>
			<View style={styles.slots}>
				{slots.map((i) => (
					<View key={i} style={[styles.slot, i < JOINED ? styles.slotOn : null]} />
				))}
			</View>
			<Text
				style={styles.note}
			>{`${String(JOINED)}/${String(size)}${CREATE_TEAM_COPY.progressNote}`}</Text>
		</GlassCard>
	);
};
