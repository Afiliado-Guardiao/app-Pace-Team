import React from "react";
import { View } from "react-native";

import { Button } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { BudSays } from "../BudSays";
import { RiseChart } from "../RiseChart";

interface IStepBoostProps {
	onDone: () => void;
}

const createStepBoostStyles = (theme: ITheme) => ({
	root: { gap: theme.pace.spacing[5] },
});

// Antes do nome · 1: o Bud conta que em equipe o desempenho sobe e o
// gráfico (desenhado como no rascunho do dono do app) vai sendo desenhado até o troféu
export const StepBoost: React.FC<IStepBoostProps> = ({ onDone }) => {
	const { theme } = useTheme();
	const styles = createStepBoostStyles(theme);

	return (
		<View style={styles.root}>
			<BudSays text={C.boostBubble} />
			<RiseChart />
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onDone}
				accessibilityLabel={C.boostCta}
				testID="setup-boost-cta"
			>
				{C.boostCta}
			</Button>
		</View>
	);
};
