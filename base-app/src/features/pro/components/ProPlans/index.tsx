import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Button } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { PRO_COPY } from "../../constants";
import { useProScreen } from "../../hooks/useProScreen";
import { PlanCard } from "../PlanCard";

interface IProPlansProps {
	screen: ReturnType<typeof useProScreen>;
}

const createProPlansStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		error: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		accent: colors.orange[400],
	};
};

const ctaOf = (screen: IProPlansProps["screen"]): string => {
	if (screen.purchase.isConfirming) return PRO_COPY.confirming;
	if (screen.selected?.trial) return PRO_COPY.startTrial;
	return `${PRO_COPY.subscribe}${screen.selected?.price ?? ""}`;
};

// Planos do Team Pro (só para o capitão de uma equipe no Free) e o botão de assinar
export const ProPlans: React.FC<IProPlansProps> = ({ screen }) => {
	const { theme } = useTheme();
	const styles = createProPlansStyles(theme);
	const isBusy = screen.purchase.isBusy || screen.purchase.isConfirming;

	return (
		<View style={styles.root}>
			<View>
				<Text style={styles.title}>{PRO_COPY.plansTitle}</Text>
				<Text style={styles.sub}>{PRO_COPY.plansSub}</Text>
			</View>
			{screen.isLoading ? <ActivityIndicator color={styles.accent} /> : null}
			{screen.isError ? <Text style={styles.error}>{PRO_COPY.loadError}</Text> : null}
			{screen.plans.map((plan) => (
				<PlanCard
					key={plan.id}
					plan={plan}
					isSelected={plan.id === screen.selected?.id}
					savings={screen.savings}
					onSelect={screen.select}
				/>
			))}
			{screen.isError ? (
				<Button size="lg" fullWidth variant="glass" onPress={screen.retry} testID="pro-retry">
					{PRO_COPY.retry}
				</Button>
			) : (
				<Button
					size="lg"
					fullWidth
					icon="crown"
					disabled={!screen.selected || isBusy}
					onPress={screen.subscribe}
					testID="pro-subscribe"
				>
					{ctaOf(screen)}
				</Button>
			)}
		</View>
	);
};
