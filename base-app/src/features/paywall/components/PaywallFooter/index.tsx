import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { PAYWALL_COPY } from "../../constants";
import { usePaywallScreen } from "../../hooks/usePaywallScreen";

interface IPaywallFooterProps {
	paywall: ReturnType<typeof usePaywallScreen>;
	hasTrial: boolean;
}

const createPaywallFooterStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3], alignItems: "center" as const },
		legal: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.micro,
			lineHeight: typography.sizes.micro * 1.5,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		links: {
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			justifyContent: "center" as const,
			gap: spacing[4],
		},
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.orange[400],
		},
		quiet: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
	};
};

// Rodapé exigido pela Apple: renovação, Termos, Privacidade, restaurar, sair e excluir.
export const PaywallFooter: React.FC<IPaywallFooterProps> = ({ paywall, hasTrial }) => {
	const { theme } = useTheme();
	const styles = createPaywallFooterStyles(theme);

	return (
		<View style={styles.root}>
			<Text style={styles.legal}>
				{PAYWALL_COPY.legal}
				{hasTrial ? PAYWALL_COPY.trialLegal : ""}
			</Text>
			<View style={styles.links}>
				<Text
					style={styles.link}
					onPress={paywall.restore}
					accessibilityRole="button"
					testID="paywall-restore"
				>
					{PAYWALL_COPY.restore}
				</Text>
				<Text
					style={styles.link}
					onPress={paywall.openTerms}
					accessibilityRole="link"
					testID="paywall-terms"
				>
					{PAYWALL_COPY.terms}
				</Text>
				<Text
					style={styles.link}
					onPress={paywall.openPrivacy}
					accessibilityRole="link"
					testID="paywall-privacy"
				>
					{PAYWALL_COPY.privacy}
				</Text>
			</View>
			<View style={styles.links}>
				<Text
					style={styles.quiet}
					onPress={paywall.signOut}
					accessibilityRole="button"
					testID="paywall-sign-out"
				>
					{PAYWALL_COPY.signOut}
				</Text>
				<Text
					style={styles.quiet}
					onPress={paywall.openDelete}
					accessibilityRole="button"
					testID="paywall-delete"
				>
					{PAYWALL_COPY.deleteAccount}
				</Text>
			</View>
		</View>
	);
};
