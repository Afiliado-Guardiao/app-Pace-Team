import React from "react";
import { Text, View } from "react-native";

import { Avatar, GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatKm, ITeamMember } from "@/lib/pace";

import { TEAM_COPY } from "../../constants";
import { Medal } from "../Medal";

interface IMemberRowProps {
	member: ITeamMember;
	position: number;
}

const createMemberRowStyles = (theme: ITheme, isYou: boolean) => {
	const { blur, colors, typography } = theme.pace;
	return {
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 12,
			paddingVertical: 10,
			paddingHorizontal: 14,
		},
		appearance: {
			fill: isYou ? ("memberYou" as const) : ("glassFill" as const),
			blur: blur.intensity.glass,
			border: isYou ? colors.memberYouBorder : colors.glassBorder,
			rim: true,
		},
		body: { flex: 1 },
		nameRow: { flexDirection: "row" as const, gap: 6, alignItems: "center" as const },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		sub: {
			marginTop: 2,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
		points: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		pointsUnit: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
		position: {
			width: 24,
			textAlign: "center" as const,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.label,
			color: colors.textTertiary,
		},
	};
};

const PODIUM_SIZE = 3;

// Integrante na lista da equipe: função, km da semana, pontos e medalha.
export const MemberRow: React.FC<IMemberRowProps> = ({ member, position }) => {
	const { theme } = useTheme();
	const styles = createMemberRowStyles(theme, Boolean(member.you));
	const isCaptain = member.role === "Capitão";

	return (
		<GlassSurface appearance={styles.appearance} radius={20} style={styles.row}>
			<Avatar name={member.name} size={40} ring={member.you} />
			<View style={styles.body}>
				<View style={styles.nameRow}>
					<Text style={styles.name}>{member.name}</Text>
					{isCaptain ? <Icon name="crown" size={14} color={theme.pace.colors.rankGold} /> : null}
				</View>
				<Text
					style={styles.sub}
				>{`${member.role} · ${formatKm(member.km, 1)}${TEAM_COPY.weekKm}`}</Text>
			</View>
			<Text style={styles.points}>
				{member.pts}
				<Text style={styles.pointsUnit}> pts</Text>
			</Text>
			{position < PODIUM_SIZE ? (
				<Medal place={position} size={24} />
			) : (
				<Text style={styles.position}>{`${String(position + 1)}º`}</Text>
			)}
		</GlassSurface>
	);
};
