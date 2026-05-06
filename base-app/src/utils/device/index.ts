import * as Localization from "expo-localization";

import { IDeviceMetadata } from "./types";

export const getDeviceMetadata = (): IDeviceMetadata => {
	try {
		const locales = Localization.getLocales();
		const calendars = Localization.getCalendars();
		const primaryLocale = locales[0];
		const primaryCalendar = calendars[0];

		return {
			deviceLanguage: primaryLocale.languageTag || null,
			deviceRegion: primaryLocale.regionCode || null,
			deviceTimezone: primaryCalendar.timeZone || null,
		};
	} catch {
		return {
			deviceLanguage: null,
			deviceRegion: null,
			deviceTimezone: null,
		};
	}
};

export * from "./types";
