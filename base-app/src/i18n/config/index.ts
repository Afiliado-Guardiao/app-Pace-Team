import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE } from "../constants";
import { resources } from "../resources";
import { detectDeviceLanguage } from "../utils/detectLanguage";
import { loadLanguage } from "../utils/persistLanguage";

export const initializeI18n = async (): Promise<typeof i18n> => {
	const storedLanguage = await loadLanguage();
	const deviceLanguage = detectDeviceLanguage();
	const initialLanguage = storedLanguage || deviceLanguage;

	await i18n.use(initReactI18next).init({
		resources,
		lng: initialLanguage,
		fallbackLng: DEFAULT_LOCALE,
		ns: ["common", "welcome", "onboarding", "auth", "profile", "home", "validation"],
		defaultNS: "common",
		interpolation: {
			escapeValue: false,
		},
		compatibilityJSON: "v4",
	});

	return i18n;
};

export { i18n };
