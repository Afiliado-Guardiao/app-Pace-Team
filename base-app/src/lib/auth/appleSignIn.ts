import { Platform } from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";

import { signInWithApple } from "@/lib/supabase";

export type IAppleSignInResult = "ok" | "cancelled" | "unavailable";

const CANCELED = "ERR_REQUEST_CANCELED";

// Login com Apple nativo (iOS) → token validado pelo Supabase Auth.
// Fora do iOS, ou sem suporte no aparelho, devolve "unavailable".
export async function signInWithAppleNative(): Promise<IAppleSignInResult> {
	if (Platform.OS !== "ios") return "unavailable";
	if (!(await AppleAuthentication.isAvailableAsync())) return "unavailable";

	try {
		const credential = await AppleAuthentication.signInAsync({
			requestedScopes: [
				AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
				AppleAuthentication.AppleAuthenticationScope.EMAIL,
			],
		});
		if (!credential.identityToken) return "unavailable";
		await signInWithApple({ idToken: credential.identityToken });
		return "ok";
	} catch (error) {
		if ((error as { code?: string }).code === CANCELED) return "cancelled";
		throw error;
	}
}
