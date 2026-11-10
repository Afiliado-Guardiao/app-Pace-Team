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

// PACE TEAM PRO dentro de Configurações: status da equipe, ver o plano,
// gerenciar/cancelar (quem paga) e restaurar compras.
export const SubscriptionSection: React.FC<ISubscriptionSectionProps> = ({ actions }) => {
	const { theme } = useTheme();
	const styles = createSubscriptionSectionStyles(theme);

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{SUBSCRIPTION_COPY.title}</Text>
			<Text style={styles.status}>{actions.proText}</Text>
			<Button fullWidth icon="crown" onPress={actions.openPro} testID="profile-open-pro">
				{SUBSCRIPTION_COPY.openPro}
			</Button>
			{actions.hasOwnSub ? (
				<>
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
				</>
			) : null}
			{actions.canManage ? (
				<Button
					fullWidth
					variant="ghost"
					disabled={actions.isBusy}
					onPress={actions.restore}
					testID="profile-restore-purchases"
				>
					{SUBSCRIPTION_COPY.restore}
				</Button>
			) : null}
		</View>
	);
};
