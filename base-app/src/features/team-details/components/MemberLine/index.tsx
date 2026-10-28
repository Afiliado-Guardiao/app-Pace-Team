import React from "react";
import { Pressable, Text, View } from "react-native";

import { Avatar, Badge, GlassSurface } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatKm, ITeamMember } from "@/lib/pace";

import { TEAM_DETAILS_COPY } from "../../constants";

interface IMemberLineProps {
	member: ITeamMember;
	// Abre o perfil do atleta
	onPress: () => void;
}

const createMemberLineStyles = (theme: ITheme) => {
	const { blur, colors, typography } = theme.pace;
	return {
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, padding: 12 },
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		body: { flex: 1, minWidth: 0 },
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
	};
};

// Integrante em Detalhes da equipe: foto, nome, função e km da semana
export const MemberLine: React.FC<IMemberLineProps> = ({ member, onPress }) => {
	const { theme } = useTheme();
	const styles = createMemberLineStyles(theme);
	const isCaptain = member.role === "Capitão";

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={member.name}
			testID={`team-member-${member.id ?? member.name}`}
		>
			<GlassSurface
				appearance={styles.appearance}
				radius={theme.pace.radii.rowSm}
				style={styles.row}
			>
				<Avatar
					name={member.name}
					src={member.avatarUrl ?? undefined}
					size={40}
					ring={member.you}
				/>
				<View style={styles.body}>
					<Text style={styles.name} numberOfLines={1}>
						{member.name}
					</Text>
					<Text style={styles.sub}>
						{`${member.role} · ${formatKm(member.km, 1)}${TEAM_DETAILS_COPY.weekKm}`}
					</Text>
				</View>
				{isCaptain ? <Badge tone="solid">{TEAM_DETAILS_COPY.captain}</Badge> : null}
			</GlassSurface>
		</Pressable>
	);
};
