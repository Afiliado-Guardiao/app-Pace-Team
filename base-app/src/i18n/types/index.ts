export type ILocale = "pt-BR" | "en-US" | "es-ES";

export type INamespace = "common" | "welcome";

export interface II18nConfig {
	lng: ILocale;
	fallbackLng: ILocale;
	ns: INamespace[];
	defaultNS: INamespace;
}
