import React from "react";
import { Text, View } from "react-native";

import { AppleLogoIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackButton } from "@/components/shared/BackButton";
import { Button, ErrorModal, GoogleIcon, Title } from "@/components/ui";
import { useTheme } from "@/theme";

import { EmailAuthModal } from "./components/EmailAuthModal";
import { useAuthBack, useAuthScreen, useDebugLogin } from "./hooks";
import { createAuthScreenStyles } from "./styles";

export const AuthScreen: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation("auth");
	const {
		isLoading,
		isAppleAuthAvailable,
		handleAppleSignIn,
		handleGoogleSignIn,
		isEmailModalVisible,
		openEmailModal,
		closeEmailModal,
		handleEmailAuthSuccess,
		errorModal,
		hideError,
	} = useAuthScreen();
	const { handleBack } = useAuthBack();
	const { isLoading: isDebugLoading, handleDebugLogin } = useDebugLogin();

	const styles = createAuthScreenStyles(theme);

	if (!isAppleAuthAvailable) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<BackButton onPress={handleBack} disabled={false} />
				</View>

				<View style={styles.content}>
					<View style={styles.unavailableContainer}>
						<Text style={styles.unavailableText}>{t("errors.appleAuthUnavailable")}</Text>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<BackButton onPress={handleBack} disabled={false} />
			</View>

			<View style={styles.content}>
				<View style={styles.titleContainer}>
					<Title level={3} style={styles.title}>
						{t("title")}
					</Title>
					<Text style={styles.subtitle}>{t("subtitle")}</Text>
				</View>

				<View style={styles.buttonContainer}>
					<Button
						testID="btn-apple-signin"
						accessibilityLabel={t("signInWith.apple")}
						onPress={() => {
							void handleAppleSignIn();
						}}
						variant="default"
						size="lg"
						disabled={isLoading}
						loading={isLoading}
						style={styles.appleButton}
					>
						<View style={styles.appleButtonContent}>
							<AppleLogoIcon size={24} color={theme.colors.white} weight="fill" />
							<Text style={styles.appleButtonText}>{t("signInWith.apple")}</Text>
						</View>
					</Button>

					<Button
						testID="btn-google-signin"
						accessibilityLabel={t("signInWith.google")}
						onPress={() => {
							void handleGoogleSignIn();
						}}
						variant="outline"
						size="lg"
						disabled={isLoading}
						style={styles.googleButton}
					>
						<View style={styles.googleButtonContent}>
							<GoogleIcon size={24} />
							<Text style={styles.googleButtonText}>{t("signInWith.google")}</Text>
						</View>
					</Button>

					<Button
						testID="btn-email-signin"
						accessibilityLabel={t("signInWith.email")}
						onPress={openEmailModal}
						variant="outline"
						size="lg"
						disabled={isLoading}
						style={styles.emailButton}
					>
						<Text style={styles.emailButtonText}>{t("signInWith.email")}</Text>
					</Button>

					{__DEV__ && (
						<Button
							testID="btn-debug-login"
							accessibilityLabel="Debug Login"
							onPress={() => {
								void handleDebugLogin();
							}}
							variant="ghost"
							size="lg"
							disabled={isDebugLoading}
							loading={isDebugLoading}
							style={styles.emailButton}
						>
							<Text style={styles.emailButtonText}>Debug Login</Text>
						</Button>
					)}
				</View>
			</View>

			<EmailAuthModal
				visible={isEmailModalVisible}
				onClose={closeEmailModal}
				onSuccess={handleEmailAuthSuccess}
			/>

			<ErrorModal
				visible={errorModal.isVisible}
				title={errorModal.title}
				message={errorModal.message}
				onClose={hideError}
			/>
		</SafeAreaView>
	);
};
