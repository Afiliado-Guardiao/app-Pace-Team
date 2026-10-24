import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SUBSCRIPTION_COPY } from "../../constants";
import { useSubscriptionActions } from "../../hooks/useSubscriptionActions";

interface ISubscriptionSectionProps {
	actions: ReturnType<typeof useSubscriptionActions>;
}

const createSubscriptionSectionStyles = (theme: ITheme) => ({
	root: { gap: theme.pace.spacing[2], marginTop: theme.pace.spacing[4] },
	title: {
		fontFamily: theme.pace.typography.fonts.bold,
		fontSize: theme.pace.typography.sizes.ui,
		color: theme.pace.colors.textPrimary,
	},
	status: {
		fontFamily: theme.pace.typography.fonts.medium,
		fontSize: theme.pace.typography.sizes.sm,
		color: theme.pace.colors.textSecondary,
	},
});

// Assinatura dentro de Configurações: status, gerenciar/cancelar e restaurar.
export const SubscriptionSection: React.FC<ISubscriptionSectionProps> = ({ actions }) => {
	const { theme } = useTheme();
	const styles = createSubscriptionSectionStyles(theme);

	if (!actions.isVisible) return null;

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{SUBSCRIPTION_COPY.title}</Text>
			<Text style={styles.status}>{actions.statusText}</Text>
			<Button
				fullWidth
				variant="glass"
				icon="credit-card"
				onPress={actions.manage}
				testID="profile-manage-subscription"
			>
				{SUBSCRIPTION_COPY.manage}
			</Button>
			<Button
				fullWidth
				variant="ghost"
				disabled={actions.isBusy}
				onPress={actions.restore}
				testID="profile-restore-purchases"
			>
				{SUBSCRIPTION_COPY.restore}
			</Button>
		</View>
	);
};
