import { useEffect, useRef } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

import { useStore } from "@/store";

export const usePaywalloAuthSync = (): void => {
	const user = useStore((state) => state.user);
	const previousUserIdRef = useRef<string | null>(null);

	useEffect(() => {
		const previousUserId = previousUserIdRef.current;
		const currentUserId = user?.id ?? null;

		if (previousUserId === currentUserId) return;

		if (currentUserId && user) {
			// `userId` (id do profile) vira `external_user_id`: é por ele que o
			// `paywallo-webhook` vincula a assinatura ao profile e o push acha o usuário.
			// E-mail é opcional (Apple Sign In pode ocultá-lo).
			void PaywalloClient.identify({
				userId: currentUserId,
				email: user.email ?? undefined,
				properties: {
					name: user.name,
					signup_at: user.createdAt,
					referral_code: user.referralCode,
				},
			});
		} else if (previousUserId && !currentUserId) {
			void PaywalloClient.reset();
		}

		previousUserIdRef.current = currentUserId;
	}, [user]);
};
