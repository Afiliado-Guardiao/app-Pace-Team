import { Platform } from "react-native";

import { IS_PREVIEW } from "@/constants/preview";

// Chave PÚBLICA do SDK do RevenueCat para iOS ("appl_…"), em
// RevenueCat › Project settings › API keys. Pode ir no app (não é segredo).
export const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "";

// Entitlement que os dois planos liberam (RevenueCat › Entitlements)
export const PREMIUM_ENTITLEMENT = "premium";

// Sem chave (desenvolvimento) ou na prévia web, a assinatura fica desligada e o
// app abre liberado — assim nada trava enquanto o RevenueCat é configurado.
export const IS_PURCHASES_ENABLED =
	Platform.OS === "ios" && REVENUECAT_IOS_KEY !== "" && !IS_PREVIEW;
