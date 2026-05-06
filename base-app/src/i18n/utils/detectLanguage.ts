import * as Localization from "expo-localization";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../constants";
import { ILocale } from "../types";

export const detectDeviceLanguage = (): ILocale => {
	const deviceLocale = Localization.getLocales()[0]?.languageTag;

	if (!deviceLocale) {
		return DEFAULT_LOCALE;
	}

	const matchedLocale = SUPPORTED_LOCALES.find(
		(locale) => deviceLocale.startsWith(locale) || locale.startsWith(deviceLocale),
	);

	return matchedLocale || DEFAULT_LOCALE;
};
