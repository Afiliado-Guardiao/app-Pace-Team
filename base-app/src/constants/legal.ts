import { Linking } from "react-native";

// Páginas públicas do PACE TEAM (GitHub Pages do branch gh-pages do repositório
// app-Pace-Team, que precisa continuar público para as páginas ficarem no ar).
// As mesmas URLs vão no App Store Connect (Política de Privacidade e Suporte).
export const LEGAL_BASE_URL = "https://afiliado-guardiao.github.io/app-Pace-Team";

export const LEGAL_URLS = {
	privacy: `${LEGAL_BASE_URL}/privacidade.html`,
	terms: `${LEGAL_BASE_URL}/termos.html`,
	support: `${LEGAL_BASE_URL}/`,
} as const;

export type ILegalPage = keyof typeof LEGAL_URLS;

// Abre a página no navegador do iPhone (falha silenciosa sem conexão).
export const openLegalPage = (page: ILegalPage): void => {
	Linking.openURL(LEGAL_URLS[page]).catch(() => undefined);
};
