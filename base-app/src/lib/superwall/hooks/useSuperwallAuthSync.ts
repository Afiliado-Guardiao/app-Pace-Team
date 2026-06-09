import { useEffect, useRef } from "react";

import { useUser } from "expo-superwall";

import { useStore } from "@/store";

type ISuperwallAttributes = Record<string, string | number | boolean>;

const buildAttributes = (user: {
	email: string | null;
	name: string;
	createdAt: string;
	referralCode: string;
}): ISuperwallAttributes => {
	const attributes: ISuperwallAttributes = {
		name: user.name,
		signupAt: user.createdAt,
		referralCode: user.referralCode,
	};

	if (user.email) {
		attributes.email = user.email;
	}

	return attributes;
};

/**
 * Sincroniza o usuário autenticado com o Superwall (reativo via store Zustand).
 *
 * - Login: `identify(userId)` + `update(attributes)` para segmentação de campanha.
 * - Logout: `signOut()` para limpar a identidade no SDK.
 *
 * É o lado Superwall da identidade. No modelo híbrido convive com o
 * `usePaywalloAuthSync` (identidade/tracking do Paywallo) — os dois rodam.
 */
export const useSuperwallAuthSync = (): void => {
	const user = useStore((state) => state.user);
	const { identify, update, signOut } = useUser();
	const previousUserIdRef = useRef<string | null>(null);

	useEffect(() => {
		const previousUserId = previousUserIdRef.current;
		const currentUserId = user?.id ?? null;

		if (previousUserId === currentUserId) return;

		if (currentUserId && user) {
			void identify(currentUserId).then(() => update(buildAttributes(user)));
		} else if (previousUserId && !currentUserId) {
			void signOut();
		}

		previousUserIdRef.current = currentUserId;
	}, [user, identify, update, signOut]);
};
