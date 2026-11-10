import React from "react";
import { Text, View } from "react-native";

import { AvatarStack, Button, GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";

interface IStepProProps {
	teamName: string;
	people: readonly { name: string; src?: string }[];
	onPro: () => void;
	onSkip: () => void;
}

const DOT = 40;

const createStepProStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[4] },
		badge: {
			alignSelf: "center" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[2],
			paddingHorizontal: spacing[4],
			paddingVertical: spacing[2],
			borderRadius: radii.pill,
			backgroundColor: colors.accentSoft,
			borderWidth: 1,
			borderColor: colors.accentBorderSoft,
		},
		badgeText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.xs,
			letterSpacing: 1.4,
			color: colors.textPrimary,
		},
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		price: { gap: spacing[1] },
		team: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		priceLine: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			justifyContent: "space-between" as const,
		},
		priceRow: { flexDirection: "row" as const, alignItems: "baseline" as const, gap: 4 },
		factRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4 },
		accent: colors.orange[400],
		value: { fontFamily: typography.fonts.extrabold, fontSize: 30, color: colors.textPrimary },
		per: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
		},
		facts: { flexDirection: "row" as const, gap: spacing[4] },
		fact: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
		},
		benefit: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.glass2,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		},
		bBody: { flex: 1 },
		bTitle: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		bText: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
			textDecorationLine: "underline" as const,
		},
		foot: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		gold: colors.semantic.gold,
		white: colors.onAccent,
	};
};

// 07 · Team Pro para o capitão (pulado se a equipe já é PRO). A compra em si
// acontece na tela PACE TEAM PRO, com os preços da Apple.
export const StepPro: React.FC<IStepProProps> = ({ teamName, people, onPro, onSkip }) => {
	const { theme } = useTheme();
	const styles = createStepProStyles(theme);

	return (
		<View style={styles.root}>
			<View style={styles.badge}>
				<Icon name="crown" size={16} color={styles.gold} />
				<Text style={styles.badgeText}>{C.proBadge}</Text>
			</View>
			<View>
				<Text style={styles.title}>{C.proTitle}</Text>
				<Text style={styles.sub}>{C.proSub}</Text>
			</View>
			<GlassCard>
				<View style={styles.price}>
					<Text style={styles.team}>{teamName}</Text>
					<View style={styles.priceLine}>
						<View style={styles.priceRow}>
							<Text style={styles.value} numberOfLines={1}>
								{C.proPrice}
							</Text>
							<Text style={styles.per}>{C.proPer}</Text>
						</View>
						<AvatarStack people={people} max={3} size={30} extra={6} />
					</View>
					<View style={styles.facts}>
						<View style={styles.factRow}>
							<Icon name="users" size={14} color={styles.accent} />
							<Text style={styles.fact}>{C.proUpTo}</Text>
						</View>
						<View style={styles.factRow}>
							<Icon name="circle-check" size={14} color={styles.accent} />
							<Text style={styles.fact}>{C.proOne}</Text>
						</View>
					</View>
				</View>
			</GlassCard>
			{C.proBenefits.map((b) => (
				<View key={b.title} style={styles.benefit}>
					<View style={styles.dot}>
						<Icon name={b.icon} size={18} />
					</View>
					<View style={styles.bBody}>
						<Text style={styles.bTitle}>{b.title}</Text>
						<Text style={styles.bText}>{b.text}</Text>
					</View>
				</View>
			))}
			<Button size="lg" fullWidth icon="crown" onPress={onPro} testID="setup-pro-cta">
				{C.proCta}
			</Button>
			<Text style={styles.link} onPress={onSkip} accessibilityRole="link" testID="setup-pro-skip">
				{C.proSkip}
			</Text>
			<Text style={styles.foot}>{C.proFoot}</Text>
		</View>
	);
};
