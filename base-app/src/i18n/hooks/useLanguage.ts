import { useTranslation } from "react-i18next";

import { useStore } from "@/store";

import { ILocale } from "../types";
import { saveLanguage } from "../utils/persistLanguage";

export const useLanguage = (): {
	currentLanguage: ILocale;
	changeLanguage: (language: ILocale) => Promise<void>;
} => {
	const { i18n } = useTranslation();
	const setStoreLanguage = useStore((state) => state.setLanguage);

	const changeLanguage = async (language: ILocale): Promise<void> => {
		await i18n.changeLanguage(language);
		await saveLanguage(language);
		setStoreLanguage(language);
	};

	return {
		currentLanguage: i18n.language as ILocale,
		changeLanguage,
	};
};
