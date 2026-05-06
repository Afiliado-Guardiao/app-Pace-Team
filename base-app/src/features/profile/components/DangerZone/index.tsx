import React from "react";
import { Pressable, Text, View } from "react-native";

import { SignOutIcon, TrashIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme";

import { createDangerZoneStyles } from "./styles";
import { IDangerZoneProps } from "./types";

export const DangerZone: React.FC<IDangerZoneProps> = ({ onLogout, onDeleteAccount }) => {
	const { theme } = useTheme();
	const { t } = useTranslation("profile");

	const styles = createDangerZoneStyles(theme);

	return (
		<View style={styles.container}>
			<View style={styles.separator} />

			<Pressable
				testID="btn-logout"
				accessibilityLabel={t("danger.logout")}
				onPress={onLogout}
				style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
			>
				<View style={styles.rowContent}>
					<SignOutIcon size={18} color={theme.colors.danger} weight="regular" />
					<Text style={styles.rowText}>{t("danger.logout")}</Text>
				</View>
			</Pressable>

			<View style={styles.separator} />

			<Pressable
				testID="btn-delete-account"
				accessibilityLabel={t("danger.deleteAccount")}
				onPress={onDeleteAccount}
				style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
			>
				<View style={styles.rowContent}>
					<TrashIcon size={18} color={theme.colors.danger} weight="regular" />
					<Text style={styles.rowText}>{t("danger.deleteAccount")}</Text>
				</View>
			</Pressable>
		</View>
	);
};
