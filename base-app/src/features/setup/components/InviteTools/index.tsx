import React from "react";
import { Pressable, Text, View } from "react-native";

import { Avatar, Button, GlassSurface, Icon, Input } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { useStepInvites } from "../../hooks/useStepInvites";

interface IInviteToolsProps {
	inv: ReturnType<typeof useStepInvites>;
}

const createInviteToolsStyles = (theme: ITheme) => {
	const { colors, spacing, typography, blur, radii } = theme.pace;
	return {
		root: { gap: spacing[3] },
		row: { flexDirection: "row" as const, gap: spacing[2] },
		tile: { flex: 1 },
		tileInner: { alignItems: "center" as const, gap: 6, paddingVertical: spacing[3] },
		tileText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
		},
		glass: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		radius: radii.lg,
		person: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		body: { flex: 1 },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		handle: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		whats: colors.statusSuccess,
	};
};

// 06 · atalhos (código, link, WhatsApp) e a busca de atletas para convidar
export const InviteTools: React.FC<IInviteToolsProps> = ({ inv }) => {
	const { theme } = useTheme();
	const styles = createInviteToolsStyles(theme);
	const tiles = [
		{ id: "code", icon: "copy", label: inv.code, onPress: inv.copyCode, color: undefined },
		{ id: "link", icon: "link", label: C.invitesCopyLink, onPress: inv.copyLink, color: undefined },
		{
			id: "whats",
			icon: "message-circle",
			label: C.invitesWhats,
			onPress: inv.openWhatsApp,
			color: styles.whats,
		},
	];

	return (
		<View style={styles.root}>
			<View style={styles.row}>
				{tiles.map((t) => (
					<Pressable
						key={t.id}
						style={styles.tile}
						onPress={t.onPress}
						accessibilityRole="button"
						accessibilityLabel={t.label}
						testID={`setup-invite-${t.id}`}
					>
						<GlassSurface appearance={styles.glass} radius={styles.radius} style={styles.tileInner}>
							<Icon name={t.icon} size={18} color={t.color} />
							<Text style={styles.tileText} numberOfLines={1}>
								{t.label}
							</Text>
						</GlassSurface>
					</Pressable>
				))}
			</View>
			<Input
				icon="search"
				value={inv.query}
				placeholder={C.invitesSearch}
				onChangeText={inv.setQuery}
				testID="setup-invite-search"
			/>
			{inv.suggestions.map((a) => (
				<View key={a.id} style={styles.person}>
					<Avatar name={a.name} size={36} />
					<View style={styles.body}>
						<Text style={styles.name}>{a.name}</Text>
						<Text style={styles.handle}>{`@${a.handle.replace(/^@/, "")}`}</Text>
					</View>
					<Button
						size="sm"
						icon="user-plus"
						disabled={inv.isFull}
						onPress={() => {
							inv.invite(a);
						}}
						testID={`setup-invite-${a.id}`}
					>
						{C.invitesInvite}
					</Button>
				</View>
			))}
		</View>
	);
};
