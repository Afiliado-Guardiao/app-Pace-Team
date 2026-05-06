import React from "react";
import { Modal as RNModal, Pressable, Text, View } from "react-native";

import { WarningDiamondIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme";

import { Button } from "../Button";

import { createErrorModalStyles } from "./styles";
import { IErrorModalProps } from "./types";

export const ErrorModal: React.FC<IErrorModalProps> = ({
	visible,
	title,
	message,
	onClose,
	confirmText,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation("common");
	const styles = createErrorModalStyles(theme);

	return (
		<RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<Pressable
				testID="error-modal-overlay"
				accessibilityLabel="Close error modal"
				onPress={onClose}
				style={styles.overlay}
			>
				<View style={styles.modalContent} onStartShouldSetResponder={() => true}>
					<View style={styles.iconContainer}>
						<WarningDiamondIcon size={32} color={theme.colors.danger} weight="fill" />
					</View>

					{title && <Text style={styles.title}>{title}</Text>}

					<Text style={styles.message}>{message}</Text>

					<View style={styles.buttonContainer}>
						<Button
							testID="error-modal-confirm-btn"
							accessibilityLabel={confirmText || t("ok")}
							onPress={onClose}
							variant="default"
							size="lg"
						>
							{confirmText || t("ok")}
						</Button>
					</View>
				</View>
			</Pressable>
		</RNModal>
	);
};
