import { Redirect } from "expo-router";

import { CatalogScreen } from "@/features/catalog";

// Catálogo do design system: só existe em desenvolvimento (em produção volta ao início).
export default function CatalogRoute() {
	if (!__DEV__) return <Redirect href="/" />;

	return <CatalogScreen />;
}
