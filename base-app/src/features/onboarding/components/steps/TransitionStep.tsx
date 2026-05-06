import React from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme";

import { createTransitionStepStyles } from "../../styles";
import { ITransitionStepProps } from "../../types";

export const TransitionStep: React.FC<ITransitionStepProps> = ({ step }) => {
	const { theme } = useTheme();
	const { t } = useTranslation("onboarding");
	const styles = createTransitionStepStyles(theme);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t(step.titleKey)}</Text>
			{step.subtitleKey && <Text style={styles.subtitle}>{t(step.subtitleKey)}</Text>}
		</View>
	);
};
