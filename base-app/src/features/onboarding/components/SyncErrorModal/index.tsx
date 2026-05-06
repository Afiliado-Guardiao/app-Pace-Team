import React from "react";
import { Modal as RNModal, Text, View } from "react-native";

import { WifiSlashIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme";

import { createSyncErrorModalStyles } from "./styles";
import { ISyncErrorModalProps } from "./types";

export const SyncErrorModal: React.FC<ISyncErrorModalProps> = ({
	visible,
	onRetry,
	isRetrying,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation("onboarding");
	const styles = createSyncErrorModalStyles(theme);

	return (
		<RNModal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<View style={styles.modalContent}>
					<View style={styles.iconContainer}>
						<WifiSlashIcon size={32} color={theme.colors.danger} weight="fill" />
					</View>

					<Text style={styles.title}>{t("sync.errorTitle")}</Text>

					<Text style={styles.message}>{t("sync.errorMessage")}</Text>

					<View style={styles.buttonContainer}>
						<Button
							testID="btn-sync-retry"
							accessibilityLabel={t("sync.retry")}
							onPress={onRetry}
							variant="default"
							size="lg"
							loading={isRetrying}
						>
							{t("sync.retry")}
						</Button>
					</View>
				</View>
			</View>
		</RNModal>
	);
};

export { useSyncErrorModal } from "./hooks/useSyncErrorModal";
