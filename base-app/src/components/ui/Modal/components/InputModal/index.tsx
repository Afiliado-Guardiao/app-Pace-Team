import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { useTheme } from "@/theme";

import { useInputModal } from "./hooks/useInputModal";
import { createInputModalStyles } from "./styles";
import { IInputModalProps } from "./types";

export const InputModal: React.FC<IInputModalProps> = ({
	options,
	onConfirm,
	onCancel,
}) => {
	const { theme } = useTheme();
	const styles = createInputModalStyles(theme);
	const { value, error, handleChangeText, handleConfirm } = useInputModal(
		options,
		onConfirm,
	);

	return (
		<View>
			<Text style={styles.title} testID="modal-input-title">
				{options.title}
			</Text>
			<TextInput
				testID="modal-input-field"
				accessibilityLabel={options.title}
				value={value}
				onChangeText={handleChangeText}
				placeholder={options.placeholder}
				placeholderTextColor={theme.colors.textMuted}
				style={[styles.input, error ? styles.inputError : null]}
				autoFocus
				returnKeyType="done"
				onSubmitEditing={handleConfirm}
			/>
			{error ? (
				<Text style={styles.errorText} testID="modal-input-error">
					{error}
				</Text>
			) : null}
			<View style={styles.buttonRow}>
				<Pressable
					testID="modal-input-cancel"
					accessibilityLabel={options.cancelLabel ?? "Cancel"}
					onPress={onCancel}
					style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.7 }]}
				>
					<Text style={styles.cancelText}>{options.cancelLabel ?? "Cancel"}</Text>
				</Pressable>
				<Pressable
					testID="modal-input-ok"
					accessibilityLabel={options.confirmLabel ?? "OK"}
					onPress={handleConfirm}
					style={({ pressed }) => [styles.confirmButton, pressed && { opacity: 0.7 }]}
				>
					<Text style={styles.confirmText}>{options.confirmLabel ?? "OK"}</Text>
				</Pressable>
			</View>
		</View>
	);
};
