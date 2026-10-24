import React from "react";
import { Text, View } from "react-native";

import { Avatar, Badge, GlassCard, IconButton } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { TEAM_COPY } from "../../constants";

interface ITeamHeroProps {
	name: string;
	logoUrl: string | null;
	place: string;
	category: string;
	onOpenDetails: () => void;
}

const createTeamHeroStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		card: { minHeight: 220 },
		top: { flexDirection: "row" as const, justifyContent: "space-between" as const },
		identity: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 14,
			marginTop: 72,
		},
		logo: { boxShadow: `0 0 0 2px ${colors.orange[500]}` },
		name: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 24,
			lineHeight: 24 * 1.1,
			color: colors.textPrimary,
		},
		place: {
			marginTop: 4,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.ink[200],
		},
	};
};

// Capa da equipe: foto, categoria, escudo, nome e cidade.
export const TeamHero: React.FC<ITeamHeroProps> = ({
	name,
	logoUrl,
	place,
	category,
	onOpenDetails,
}) => {
	const { theme } = useTheme();
	const styles = createTeamHeroStyles(theme);

	return (
		<GlassCard image={PHOTOS.teamRunningSunset} padding={18} style={styles.card}>
			<View style={styles.top}>
				<Badge tone="solid">{category}</Badge>
				<IconButton
					icon="settings-2"
					size={38}
					label={TEAM_COPY.settings}
					onPress={onOpenDetails}
					testID="team-settings"
				/>
			</View>
			<View style={styles.identity}>
				<Avatar name={name} src={logoUrl ?? undefined} square size={58} style={styles.logo} />
				<View>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.place}>{place}</Text>
				</View>
			</View>
		</GlassCard>
	);
};
