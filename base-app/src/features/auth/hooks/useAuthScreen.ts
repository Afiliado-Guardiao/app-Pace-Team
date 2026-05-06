import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { useTranslation } from "react-i18next";

import { useErrorModal } from "@/components/ui/ErrorModal/hooks/useErrorModal";
import { useModal } from "@/components/ui/Modal";
import { ROUTES } from "@/constants/routes";

import { IAuthScreenData } from "../types";

export const useAuthScreen = (): IAuthScreenData => {
	const router = useRouter();
	const { errorModal, hideError } = useErrorModal();
	const modal = useModal();
	const { t } = useTranslation("auth");

	const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);

	const handleAppleSignIn = useCallback(async (): Promise<void> => {
		await modal.alert({
			title: t("comingSoon.title", { defaultValue: "Em breve" }),
			message: t("comingSoon.apple", { defaultValue: "Login com Apple estará disponível em breve." }),
		});
	}, [modal, t]);

	const handleGoogleSignIn = useCallback(async (): Promise<void> => {
		await modal.alert({
			title: t("comingSoon.title", { defaultValue: "Em breve" }),
			message: t("comingSoon.google", { defaultValue: "Login com Google estará disponível em breve." }),
		});
	}, [modal, t]);

	const openEmailModal = useCallback(() => {
		setIsEmailModalVisible(true);
	}, []);

	const closeEmailModal = useCallback(() => {
		setIsEmailModalVisible(false);
	}, []);

	const handleEmailAuthSuccess = useCallback(() => {
		router.replace(ROUTES.HOME);
	}, [router]);

	return {
		isLoading: false,
		isAppleAuthAvailable: true,
		handleAppleSignIn,
		handleGoogleSignIn,
		isEmailModalVisible,
		openEmailModal,
		closeEmailModal,
		handleEmailAuthSuccess,
		errorModal,
		hideError,
	};
};
