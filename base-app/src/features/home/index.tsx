import React from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { Section, Text, Title } from "@/components/ui";
import { useTheme } from "@/theme";

import { useHomeScreen, useReferralPrompt } from "./hooks";
import { createHomeStyles } from "./styles";

export const HomeScreen: React.FC = () => {
	const { theme } = useTheme();
	const { t, i18n } = useTranslation("home");
	const styles = createHomeStyles(theme);
	const { userName, userEmail, userBirthday, memberSince, timeOfDay } = useHomeScreen(
		i18n.language,
	);

	useReferralPrompt();

	const greeting = userName
		? t(`greeting.${timeOfDay}`, { name: userName })
		: t(`greeting.${timeOfDay}NoName`);

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<View style={styles.content}>
				<Title level={1}>{t("title")}</Title>

				<View style={styles.greetingBlock}>
					<Title level={3}>{greeting}</Title>
					<Text variant="body" style={styles.muted}>
						{t("welcome")}
					</Text>
				</View>

				<Section title={t("yourData.title")}>
					<View style={styles.dataRow}>
						<Text variant="label" style={styles.muted}>
							{t("yourData.email")}
						</Text>
						<Text variant="body">{userEmail ?? t("yourData.notProvided")}</Text>
					</View>
					<View style={styles.dataRow}>
						<Text variant="label" style={styles.muted}>
							{t("yourData.birthday")}
						</Text>
						<Text variant="body">{userBirthday ?? t("yourData.notProvided")}</Text>
					</View>
					<View style={styles.dataRow}>
						<Text variant="label" style={styles.muted}>
							{t("yourData.memberSince")}
						</Text>
						<Text variant="body">{memberSince ?? t("yourData.notProvided")}</Text>
					</View>
				</Section>
			</View>
		</SafeAreaView>
	);
};
