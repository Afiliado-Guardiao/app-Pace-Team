import React from "react";
import { Text, View } from "react-native";

import { Avatar, Badge, Button } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { PROFILE_COPY } from "../../constants";

interface IProfileHeaderProps {
	name: string;
	// Foto de perfil (null = iniciais)
	avatarUrl: string | null;
	handle: string;
	city: string;
	team: string;
	role: string | null;
	onEdit: () => void;
}

const createProfileHeaderStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		root: { alignItems: "center" as const, gap: 10, marginTop: -10 },
		texts: { alignItems: "center" as const },
		name: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 24,
			lineHeight: 24 * 1.15,
			color: colors.textPrimary,
		},
		sub: {
			marginTop: 4,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		badges: { flexDirection: "row" as const, gap: 8 },
	};
};

// Foto, nome, @ e cidade, equipe/função e "Editar perfil".
export const ProfileHeader: React.FC<IProfileHeaderProps> = ({
	name,
	avatarUrl,
	handle,
	city,
	team,
	role,
	onEdit,
}) => {
	const { theme } = useTheme();
	const styles = createProfileHeaderStyles(theme);

	return (
		<View style={styles.root}>
			<Avatar name={name} src={avatarUrl ?? undefined} size={92} ring />
			<View style={styles.texts}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.sub}>{[handle, city].filter(Boolean).join(" · ")}</Text>
			</View>
			<View style={styles.badges}>
				<Badge tone="accent">{team}</Badge>
				{role ? <Badge tone="solid">{role}</Badge> : null}
			</View>
			<Button size="sm" variant="glass" icon="pencil" onPress={onEdit} testID="profile-edit">
				{PROFILE_COPY.edit}
			</Button>
		</View>
	);
};
