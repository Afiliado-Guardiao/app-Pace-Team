import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { createConfirmModalStyles } from "./styles";
import { IConfirmModalProps } from "./types";

export const ConfirmModal: React.FC<IConfirmModalProps> = ({ options, onConfirm, onCancel }) => {
	const { theme } = useTheme();
	const variant = options.variant ?? "default";
	const styles = createConfirmModalStyles(theme, variant);

	return (
		<View>
			<Text style={styles.title} testID="modal-confirm-title">
				{options.title}
			</Text>
			{options.message ? (
				<Text style={styles.message} testID="modal-confirm-message">
					{options.message}
				</Text>
			) : null}
			<View style={styles.buttonRow}>
				<Pressable
					testID="modal-confirm-cancel"
					accessibilityLabel={options.cancelLabel ?? "Cancel"}
					onPress={onCancel}
					style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.7 }]}
				>
					<Text style={styles.cancelText}>{options.cancelLabel ?? "Cancel"}</Text>
				</Pressable>
				<Pressable
					testID="modal-confirm-ok"
					accessibilityLabel={options.confirmLabel ?? "OK"}
					onPress={onConfirm}
					style={({ pressed }) => [styles.confirmButton, pressed && { opacity: 0.7 }]}
				>
					<Text style={styles.confirmText}>{options.confirmLabel ?? "OK"}</Text>
				</Pressable>
			</View>
		</View>
	);
};
