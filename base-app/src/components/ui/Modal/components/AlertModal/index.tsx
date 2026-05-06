import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { createAlertModalStyles } from "./styles";
import { IAlertModalProps } from "./types";

export const AlertModal: React.FC<IAlertModalProps> = ({ options, onConfirm }) => {
	const { theme } = useTheme();
	const styles = createAlertModalStyles(theme);

	return (
		<View>
			<Text style={styles.title} testID="modal-alert-title">
				{options.title}
			</Text>
			{options.message ? (
				<Text style={styles.message} testID="modal-alert-message">
					{options.message}
				</Text>
			) : null}
			<Pressable
				testID="modal-alert-ok"
				accessibilityLabel={options.confirmLabel ?? "OK"}
				onPress={onConfirm}
				style={({ pressed }) => [styles.confirmButton, pressed && { opacity: 0.7 }]}
			>
				<Text style={styles.confirmText}>{options.confirmLabel ?? "OK"}</Text>
			</Pressable>
		</View>
	);
};
