import * as Localization from "expo-localization";

import { IErrorBoundaryLocale } from "../translations";

const DEFAULT_LOCALE: IErrorBoundaryLocale = "en-US";

const SUPPORTED_LOCALES: IErrorBoundaryLocale[] = ["pt-BR", "en-US", "es-ES"];

export const detectErrorBoundaryLanguage = (): IErrorBoundaryLocale => {
	try {
		const deviceLocale = Localization.getLocales()[0]?.languageTag;

		if (!deviceLocale) {
			return DEFAULT_LOCALE;
		}

		const matchedLocale = SUPPORTED_LOCALES.find(
			(locale) => deviceLocale.startsWith(locale) || locale.startsWith(deviceLocale.split("-")[0]),
		);

		return matchedLocale || DEFAULT_LOCALE;
	} catch {
		return DEFAULT_LOCALE;
	}
};
