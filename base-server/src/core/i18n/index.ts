import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { join } from "path";

const DEFAULT_LOCALE = "pt-BR";
const SUPPORTED_LOCALES = ["pt-BR", "en-US", "es-ES"];

export const initializeI18n = async (): Promise<typeof i18next> => {
	await i18next.use(Backend).init({
		lng: DEFAULT_LOCALE,
		fallbackLng: DEFAULT_LOCALE,
		supportedLngs: SUPPORTED_LOCALES,
		ns: ["errors", "validation"],
		defaultNS: "errors",
		backend: {
			loadPath: join(__dirname, "resources", "{{lng}}", "{{ns}}.json"),
		},
		interpolation: {
			escapeValue: false,
		},
	});

	return i18next;
};

export const detectLanguageFromHeader = (acceptLanguage: string | undefined): string => {
	if (!acceptLanguage) return DEFAULT_LOCALE;

	const languages = acceptLanguage
		.split(",")
		.map((lang) => {
			const parts = lang.trim().split(";");
			const locale = parts[0];
			return locale ?? "";
		})
		.filter((lang) => SUPPORTED_LOCALES.includes(lang));

	return languages[0] ?? DEFAULT_LOCALE;
};

export { i18next };
