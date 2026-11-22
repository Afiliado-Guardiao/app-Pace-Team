import React from "react";
import { View } from "react-native";

import { Button } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { BudSays } from "../BudSays";
import { PlanRoute } from "../PlanRoute";

interface IStepPlanProps {
	onDone: () => void;
}

const createStepPlanStyles = (theme: ITheme) => ({
	root: { gap: theme.pace.spacing[5] },
});

// Antes do nome · 2: "Montamos cada passo." O caminho (arte do dono do
// app) vai sendo feito, parada por parada, até o grande prêmio
export const StepPlan: React.FC<IStepPlanProps> = ({ onDone }) => {
	const { theme } = useTheme();
	const styles = createStepPlanStyles(theme);

	return (
		<View style={styles.root}>
			<BudSays text={C.planBubble} />
			<PlanRoute />
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onDone}
				accessibilityLabel={C.planCta}
				testID="setup-plan-cta"
			>
				{C.planCta}
			</Button>
		</View>
	);
};
