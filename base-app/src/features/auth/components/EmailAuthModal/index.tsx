import React from "react";
import { Modal as RNModal, Pressable, Text, View } from "react-native";

import { XIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button } from "@/components/ui";
import { useTheme } from "@/theme";

import { EmailAuthInput } from "../EmailAuthInput";

import { useEmailAuthModal } from "./hooks/useEmailAuthModal";
import { createEmailAuthModalStyles } from "./styles";
import { IEmailAuthModalProps } from "./types";

export const EmailAuthModal: React.FC<IEmailAuthModalProps> = ({ visible, onClose, onSuccess }) => {
	const { theme } = useTheme();
	const { t } = useTranslation("auth");
	const {
		authMode,
		formValues,
		errors,
		isLoading,
		handleInputChange,
		handleSubmit,
		toggleAuthMode,
	} = useEmailAuthModal({ onClose, onSuccess });

	const styles = createEmailAuthModalStyles(theme);

	const handleClose = () => {
		if (!isLoading) {
			onClose();
		}
	};

	return (
		<RNModal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
			<Pressable
				testID="email-auth-modal-overlay"
				accessibilityLabel="Close email auth modal"
				onPress={handleClose}
				style={styles.overlay}
				disabled={isLoading}
			>
				<View style={styles.modalContent} onStartShouldSetResponder={() => true}>
					<View style={styles.header}>
						<Text style={styles.title}>
							{authMode === "login" ? t("email.login.title") : t("email.register.title")}
						</Text>
						<Pressable testID="btn-email-auth-close" accessibilityLabel="Close" onPress={handleClose} style={styles.closeButton} disabled={isLoading}>
							<XIcon size={24} color={theme.colors.text} />
						</Pressable>
					</View>

					<KeyboardAwareScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						contentContainerStyle={styles.scrollContent}
					>
						<View style={styles.form}>
							{authMode === "register" && (
								<EmailAuthInput
									label={t("email.fields.name")}
									value={formValues.name}
									onChangeText={(text) => {
										handleInputChange("name", text);
									}}
									placeholder={t("email.fields.namePlaceholder")}
									error={errors.name}
									autoCapitalize="words"
									returnKeyType="next"
								/>
							)}

							<EmailAuthInput
								label={t("email.fields.email")}
								value={formValues.email}
								onChangeText={(text) => {
									handleInputChange("email", text);
								}}
								placeholder={t("email.fields.emailPlaceholder")}
								error={errors.email}
								keyboardType="email-address"
								autoCapitalize="none"
								returnKeyType="next"
							/>

							<EmailAuthInput
								label={t("email.fields.password")}
								value={formValues.password}
								onChangeText={(text) => {
									handleInputChange("password", text);
								}}
								placeholder={
									authMode === "register"
										? t("email.fields.passwordPlaceholderRegister")
										: t("email.fields.passwordPlaceholderLogin")
								}
								error={errors.password}
								secureTextEntry
								returnKeyType={authMode === "register" ? "next" : "done"}
								onSubmitEditing={authMode === "login" ? handleSubmit : undefined}
							/>

							{authMode === "register" && (
								<EmailAuthInput
									label={t("email.fields.confirmPassword")}
									value={formValues.confirmPassword}
									onChangeText={(text) => {
										handleInputChange("confirmPassword", text);
									}}
									placeholder={t("email.fields.confirmPasswordPlaceholder")}
									error={errors.confirmPassword}
									secureTextEntry
									returnKeyType="done"
									onSubmitEditing={handleSubmit}
								/>
							)}

							<Button
								testID="btn-email-auth-submit"
								accessibilityLabel={authMode === "login" ? t("email.actions.login") : t("email.actions.register")}
								onPress={handleSubmit}
								loading={isLoading}
								disabled={isLoading}
								style={styles.submitButton}
								variant="default"
								size="lg"
							>
								{authMode === "login" ? t("email.actions.login") : t("email.actions.register")}
							</Button>

							<Pressable testID="btn-auth-mode-switch" accessibilityLabel="Switch auth mode" onPress={toggleAuthMode} style={styles.switchButton} disabled={isLoading}>
								<Text style={styles.switchText}>
									{authMode === "login"
										? t("email.actions.switchToRegister")
										: t("email.actions.switchToLogin")}
									<Text style={styles.switchTextBold}>
										{authMode === "login"
											? t("email.actions.switchToRegisterBold")
											: t("email.actions.switchToLoginBold")}
									</Text>
								</Text>
							</Pressable>
						</View>
					</KeyboardAwareScrollView>
				</View>
			</Pressable>
		</RNModal>
	);
};
