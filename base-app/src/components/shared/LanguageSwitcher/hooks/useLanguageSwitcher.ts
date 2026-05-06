import { useCallback, useState } from "react";

import { ILocale, useLanguage } from "@/i18n";

export const useLanguageSwitcher = (): {
	currentLanguage: ILocale;
	isModalOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	handleLanguageChange: (language: ILocale) => void;
} => {
	const { currentLanguage, changeLanguage } = useLanguage();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = useCallback((): void => {
		setIsModalOpen(true);
	}, []);

	const closeModal = useCallback((): void => {
		setIsModalOpen(false);
	}, []);

	const handleLanguageChange = useCallback(
		(language: ILocale): void => {
			void changeLanguage(language);
			closeModal();
		},
		[changeLanguage, closeModal],
	);

	return {
		currentLanguage,
		isModalOpen,
		openModal,
		closeModal,
		handleLanguageChange,
	};
};
