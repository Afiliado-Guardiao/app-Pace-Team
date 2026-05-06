// Este componente NÃO pode usar contexts/hooks (useTheme, useTranslation, etc) — é a última linha de defesa e precisa funcionar independente

import React from "react";
import { Pressable, Text, View } from "react-native";

import { errorBoundaryTranslations } from "../translations";
import { detectErrorBoundaryLanguage } from "../utils/detectLanguage";

import { createErrorFallbackStyles } from "./styles";
import { IErrorFallbackProps } from "./types";

export const ErrorFallback: React.FC<IErrorFallbackProps> = ({ error, resetError }) => {
	const styles = createErrorFallbackStyles();
	const fallbackLanguage = detectErrorBoundaryLanguage();
	const translations = errorBoundaryTranslations[fallbackLanguage];

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.iconContainer}>
					<Text style={styles.icon}>⚠️</Text>
				</View>
				<Text style={styles.title}>{translations.title}</Text>
				<Text style={styles.message}>{translations.message}</Text>
				<Text style={styles.errorDetails}>{error.message}</Text>
				<Pressable
					testID="btn-error-reset"
					accessibilityLabel="Reset"
					style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
					onPress={resetError}
				>
					<Text style={styles.buttonText}>{translations.button}</Text>
				</Pressable>
			</View>
		</View>
	);
};
