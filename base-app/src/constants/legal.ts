import { Linking } from "react-native";

// Páginas públicas do PACE TEAM (GitHub Pages do repositório pace-team-site).
// As mesmas URLs vão no App Store Connect (Política de Privacidade e Suporte).
export const LEGAL_BASE_URL = "https://afiliado-guardiao.github.io/pace-team-site";

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
