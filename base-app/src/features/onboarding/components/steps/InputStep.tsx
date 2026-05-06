import React from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";

import { TextInput } from "@/components/ui";
import { useTheme } from "@/theme";

import { useInputStep } from "../../hooks";
import { createInputStepStyles } from "../../styles";
import { IInputStepProps } from "../../types";
import { AnimatedContent } from "../AnimatedContent";

export const InputStep: React.FC<IInputStepProps> = ({ step, value, onChange, error }) => {
	const { theme } = useTheme();
	const { t } = useTranslation("onboarding");
	const { handleChange } = useInputStep({ step, onChange });
	const styles = createInputStepStyles(theme);

	return (
		<View style={styles.container}>
			<AnimatedContent triggerKey={step.id}>
				<Text style={styles.title}>{t(step.titleKey)}</Text>
				{step.subtitleKey && <Text style={styles.subtitle}>{t(step.subtitleKey)}</Text>}
			</AnimatedContent>
			<TextInput
				testID={`input-${step.id}`}
				accessibilityLabel={t(step.titleKey)}
				value={value}
				onChangeText={handleChange}
				placeholder={t(step.placeholderKey)}
				keyboardType={step.keyboardType}
				error={error}
				style={styles.inputWrapper}
			/>
		</View>
	);
};
