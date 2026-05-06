import React from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageSwitcher } from "@/components/shared";
import { Button, Text, Title } from "@/components/ui";
import { useTheme } from "@/theme";

import { useWelcomeScreen } from "./hooks/useWelcomeScreen";
import { createWelcomeScreenStyles } from "./styles";

export const WelcomeScreen: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation("welcome");
	const { handleStartOnboarding } = useWelcomeScreen();
	const styles = createWelcomeScreenStyles(theme);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<LanguageSwitcher />
			</View>

			<View style={styles.content}>
				<Title level={1} style={styles.title}>
					{t("title")}
				</Title>
				<Text variant="body" style={styles.subtitle}>
					{t("subtitle")}
				</Text>
			</View>

			<View style={styles.footer}>
				<Button
					testID="btn-start-onboarding"
					accessibilityLabel={t("cta")}
					onPress={handleStartOnboarding}
					style={styles.ctaButton}
				>
					{t("cta")}
				</Button>
			</View>
		</SafeAreaView>
	);
};
