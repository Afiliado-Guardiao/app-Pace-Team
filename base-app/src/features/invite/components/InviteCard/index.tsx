import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { INVITE_COPY } from "../../constants";

interface IInviteCardProps {
	title: string;
	code: string;
	capacity: number;
	used: number;
	left: number;
	onCopyLink: () => void;
	onWhatsApp: () => void;
}

const DOT = 10;

const createInviteCardStyles = (theme: ITheme, left: number) => {
	const { colors, typography } = theme.pace;
	return {
		header: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
		},
		team: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.body,
			color: colors.textPrimary,
		},
		left: {
			marginTop: 3,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.label,
			color: left ? colors.orange[400] : colors.statusSuccess,
		},
		dots: { flexDirection: "row" as const, gap: 5 },
		dot: { width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: colors.slotDotEmpty },
		dotOn: { backgroundColor: colors.orange[500] },
		actions: { flexDirection: "row" as const, gap: 8, marginTop: 14 },
		action: { flex: 1 },
	};
};

// Vagas da equipe e atalhos de convite (copiar link, WhatsApp).
export const InviteCard: React.FC<IInviteCardProps> = ({
	title,
	code,
	capacity,
	used,
	left,
	onCopyLink,
	onWhatsApp,
}) => {
	const { theme } = useTheme();
	const styles = createInviteCardStyles(theme, left);
	const slots = Array.from({ length: capacity }, (_, i) => i);
	const leftLabel = left === 1 ? INVITE_COPY.leftOne : INVITE_COPY.leftMany;

	return (
		<GlassCard padding={16}>
			<View style={styles.header}>
				<View>
					<Text style={styles.team}>{title}</Text>
					<Text style={styles.left}>
						{left ? `${String(left)}${leftLabel}` : INVITE_COPY.full}
						{`  ·  ${INVITE_COPY.codeLabel}${code}`}
					</Text>
				</View>
				<View style={styles.dots}>
					{slots.map((i) => (
						<View key={i} style={[styles.dot, i < used ? styles.dotOn : null]} />
					))}
				</View>
			</View>
			<View style={styles.actions}>
				<Button
					size="sm"
					variant="glass"
					icon="link"
					style={styles.action}
					onPress={onCopyLink}
					testID="invite-copy-link"
				>
					{INVITE_COPY.copyLink}
				</Button>
				<Button
					size="sm"
					variant="whatsapp"
					icon="message-circle"
					style={styles.action}
					onPress={onWhatsApp}
					testID="invite-whatsapp"
				>
					{INVITE_COPY.whatsapp}
				</Button>
			</View>
		</GlassCard>
	);
};
